import React from 'react'
import '../App.css'
import { Typography, Row, Col, Card, Checkbox, Popconfirm } from 'antd'
import { TitleFilter, Filters } from '../components'
import {
	PlusCircleOutlined,
	CheckOutlined,
	DeleteOutlined,
	EditOutlined,
} from '@ant-design/icons'
import { getExtractData, removeTransaction, planToPrincipal } from '../api'
import { openNotification, formatDateToUser, prepareValue } from '../utils'

const { Title } = Typography
const descriptionsList = new Set()
const now = new Date()
const nextMonthDate = new Date(now.setMonth(new Date().getMonth() + 1))
const nextMonthYear = nextMonthDate.getFullYear()
const nextMonthMonth = nextMonthDate.getMonth() + 1

class ExtractPlan extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			transactions: [],
			allTransactions: [],
			checked: [],
			year: nextMonthYear,
			month: nextMonthMonth,
			notCompensated: false,
			bankId: null,
			description: '',
			detail: '',
			banks: [],
			descriptions: [],
			idToEdit: null,
			menu: {
				modalVisible: false,
				transactionToUpdate: null,
			},
		}
		this.handleChange = this.handleChange.bind(this)
		this.submitForm = this.submitForm.bind(this)
		this.toAccount = this.toAccount.bind(this)
		this.deleteTransactionChecked = this.deleteTransactionChecked.bind(this)
		this.isChecked = this.isChecked.bind(this)
		this.remover = this.remover.bind(this)
		this.processExtractData = this.processExtractData.bind(this)
	}

	componentDidUpdate() {
		if (this.props.update) {
			this.processExtractData()
		}
	}

	componentDidMount() {
		this.props.mudaTitulo('Extrato > Planejamentos Futuros')
		this.processExtractData()
	}

	processExtractData() {
		this.props.loading(true)
		return getExtractData('planejamento')
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					const extractData = res.data

					extractData?.transactionList?.forEach((element) => {
						if (element.description) {
							descriptionsList.add(element.description)
						}
					})

					this.setState((state) => {
						state.banks = extractData.banksList
						state.transactions = extractData.transactionList
						state.allTransactions = extractData.transactionList
						state.descriptions = [...descriptionsList].sort((a, b) =>
							a.localeCompare(b)
						)
						return state
					})
				}
				this.filterList()
				this.props.loading(false)
			})
			.catch((err) => {
				openNotification('error', 'Erro ao listar os bancos', err.message)
			})
	}

	handleChange(event) {
		this.setState((state) => {
			switch (event.target.name) {
				case 'clearFilter':
					state.transactions = state.allTransactions
					state.year = null
					state.month = null
					state.bankId = null
					state.description = ''
					state.detail = ''
					state.checked = []
					break

				case 'name':
					state.name = event.target.value
					break

				case 'isActive':
					state.data.isActive = !state.data.isActive
					break

				case 'bankType':
					state.data.bankType = event.target.value
					break

				case 'bankId':
					state.bankId = event.target.value
					state.checked = []
					break

				case 'description':
					state.description = event.target.value
					state.checked = []
					break

				case 'descriptionList':
					if (event?.target?.value?.length > 0) {
						state.descriptions = event.target.value
						this.processExtractData()
					}
					break

				case 'detail':
					state.detail = event.target.value
					state.checked = []
					break

				case 'checkbox':
					const id = event.target.value
					if (this.isChecked(id)) {
						this.removeChecked(id)
					} else {
						state.checked.push(id)
					}
					break

				case 'date':
					state.year = event.target.value.year
					state.month = event.target.value.month
					state.checked = []
					break

				case 'clearDate':
					const now = new Date()
					state.year = now.getFullYear()
					state.month = now.getMonth() + 1
					state.checked = []
					break

				default:
			}
			return state
		}, this.filterList)
	}

	removeChecked(id) {
		this.setState((state) => {
			state.checked = state.checked.filter((element) => element !== id)
			return state
		})
	}

	isChecked(id) {
		if (this.state.checked.includes(id)) {
			return true
		} else {
			return false
		}
	}

	deleteTransactionChecked() {
		this.props.loading(true)

		const checked = this.state.checked

		for (let i = 0; i < checked.length; i++) {
			removeTransaction(checked[i])
				.then((res) => {
					if (res.data.code === 202) {
						openNotification(
							'success',
							'Transação removida',
							'Transação removida com sucesso.'
						)

						this.processExtractData()
					} else {
						openNotification(
							'error',
							'Transação não removida',
							`A Transação não pode ser removida. ${res?.data?.message}`
						)
					}
				})
				.catch((err) => {
					openNotification(
						'error',
						'Transação não removida',
						'Erro interno. Tente novamente mais tarde.'
					)
				})
		}
		this.setState({ checked: [] })
	}

	filterList() {
		this.setState((state) => {
			const transactionFiltered = state.allTransactions.filter(
				(transaction) => {
					let toReturn = true

					if (this.state.bankId !== null) {
						if (
							transaction.bankId._id.toString() !== this.state.bankId.toString()
						) {
							toReturn = false
						}
					}

					if (this.state.description !== '') {
						const description = transaction?.description?.toLowerCase()
						const filterDescription = this?.state?.description?.toLowerCase()
						if (!description?.includes(filterDescription)) {
							toReturn = false
						}
					}

					if (this.state.detail !== '') {
						const detail = transaction?.detail?.toLowerCase()
						const filterDetail = this?.state?.detail?.toLowerCase()
						if (!detail?.includes(filterDetail)) {
							toReturn = false
						}
					}

					if (this.state.year !== null) {
						let now = new Date(transaction.effectedAt)
						const ano = now.getFullYear()

						if (ano !== parseInt(this.state.year, 10)) {
							toReturn = false
						}
					}

					if (this.state.month !== null) {
						let now = new Date(transaction.effectedAt)
						const mes = now.getMonth() + 1

						if (mes !== parseInt(this.state.month, 10)) {
							toReturn = false
						}
					}

					if (toReturn) {
						return transaction
					}
					return null
				}
			)

			state.transactions = transactionFiltered
			state.checked = state.checked.filter((id) =>
				transactionFiltered.some((transaction) => transaction._id === id)
			)
			return state
		})
	}

	remover(id) {
		return removeTransaction(id)
			.then((res) => {
				if (res.data.code === 202) {
					openNotification(
						'success',
						'Transação removida',
						'Transação removida com sucesso.'
					)
					this.processExtractData()
				} else {
					openNotification(
						'error',
						'Transação não removida',
						`A Transação não pode ser removida. ${res?.data?.message}`
					)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Transação não removida',
					'Erro interno. Tente novamente mais tarde.'
				)
			})
	}

	toAccount() {
		this.props.loading(true)
		const transactionsToAccount = this.state.transactions.filter(
			(transaction) => this.state.checked.includes(transaction._id)
		)
		planToPrincipal(transactionsToAccount)
			.then((res) => {
				if (res.data.code === 201 || res.data.code === 202) {
					openNotification(
						'success',
						'Transações atualizadas',
						'Transações atualizadas com sucesso.'
					)
					this.processExtractData()
				} else {
					openNotification(
						'error',
						'Transações não atualizadas',
						res.data.message
					)
				}
				this.props.loading(false)
			})
			.catch((err) => {
				openNotification(
					'error',
					'Transações não atualizadas',
					'Erro interno. Tente novamente mais tarde.'
				)
				this.props.loading(false)
			})
	}

	submitForm(e) {}

	showMenuModal = (data) => {
		if (this.state.menu.modalVisible !== data) {
			this.setState((state) => {
				state.menu.modalVisible = true
				state.menu.transactionToUpdate = data
				return state
			})
		}
	}

	menuModalClose = (e) => {
		this.setState((state) => {
			state.menu.modalVisible = false
			return state
		})
	}

	render() {
		return (
			<div>
				<div>
					<TitleFilter handleChange={this.handleChange} />
					<Filters
						handleChange={this.handleChange}
						year={this.state.year}
						month={this.state.month}
						bankId={this.state.bankId}
						banks={this.state.banks}
						descriptions={this.state.descriptions}
						description={this.state.description}
						detail={this.state.detail}
					/>
					<div>
						<Title level={4}>
							Transações
							<PlusCircleOutlined
								style={{
									marginLeft: '15px',
									marginRight: '15px',
									cursor: 'pointer',
								}}
								onClick={() => {
									this.props.showModal({ transactionType: 'planejamento' })
								}}
							/>
							<Popconfirm
								title='Deseja lançar essas transações em Conta Corrente?'
								onConfirm={this.toAccount}
								okText='Sim'
								cancelText='Não'
								disabled={this.state.checked.length === 0}
							>
								<span
									style={{
										marginRight: '15px',
										cursor:
											this.state.checked.length > 0 ? 'pointer' : 'not-allowed',
										color:
											this.state.checked.length > 0 ? 'inherit' : '#d9d9d9',
									}}
								>
									<CheckOutlined />
								</span>
							</Popconfirm>
							<Popconfirm
								title='Deseja realmente apagar as transações selecionadas?'
								onConfirm={() => {
									this.deleteTransactionChecked()
								}}
								okText='Sim'
								cancelText='Não'
								disabled={this.state.checked.length === 0}
							>
								<DeleteOutlined
									style={{
										marginRight: '15px',
										cursor:
											this.state.checked.length > 0 ? 'pointer' : 'not-allowed',
										color:
											this.state.checked.length > 0 ? 'inherit' : '#d9d9d9',
									}}
								/>
							</Popconfirm>
							<Checkbox
								checked={
									this.state.checked.length ===
										this.state.transactions.length &&
									this.state.transactions.length > 0
								}
								indeterminate={
									this.state.checked.length > 0 &&
									this.state.checked.length < this.state.transactions.length
								}
								onChange={(e) => {
									if (e.target.checked) {
										this.setState((state) => ({
											checked: state.transactions.map((t) => t._id),
										}))
									} else {
										this.setState({ checked: [] })
									}
								}}
							/>
						</Title>
					</div>

					{this.state.transactions.map((element) => {
						const transactionValue = prepareValue(
							element.value,
							element.isCompensated
						)

						const title = (
							<>
								<span
									style={{
										paddingRight: '10px',
									}}
								>
									<Checkbox
										checked={this.isChecked(element._id)}
										onChange={() => {
											this.handleChange({
												target: { name: 'checkbox', value: element._id },
											})
										}}
									/>
								</span>
								<span>{element.description || 'Transação Genérica'}</span>
								<span
									style={{
										float: 'right',
										display: 'flex',
										gap: '15px',
										fontSize: '18px',
									}}
								>
									<EditOutlined
										style={{ cursor: 'pointer', color: '#006400' }}
										onClick={() => {
											this.props.showModal({
												transactionType: 'planejamento',
												transactionId: element._id,
											})
										}}
									/>
									<Popconfirm
										title='Deseja realmente apagar essa Transação?'
										onConfirm={() => {
											this.remover(element._id).then(() => {
												this.processExtractData()
											})
										}}
										okText='Sim'
										cancelText='Não'
									>
										<DeleteOutlined
											style={{ cursor: 'pointer', color: 'red' }}
										/>
									</Popconfirm>
								</span>
							</>
						)

						return (
							<Card
								size='small'
								title={title}
								style={{ maxWidth: 560, marginBottom: '5px' }}
								key={element._id}
							>
								<Row>
									<Col span={12} title={formatDateToUser(element.createdAt)}>
										Efetivação: {formatDateToUser(element.effectedAt)}
									</Col>
									<Col span={12} style={{ textAlign: 'right' }}>
										Valor:{' '}
										<span
											style={{
												color: transactionValue.color,
											}}
										>
											{transactionValue.value}
										</span>
									</Col>
								</Row>
								<Row>
									<Col span={24} title={element.bankId?.name}>
										Banco: {element.bankName}
									</Col>
								</Row>
								<Row>
									<Col span={24}>Detalhes: {element.detail}</Col>
								</Row>
							</Card>
						)
					})}
				</div>
			</div>
		)
	}
}
export default ExtractPlan
