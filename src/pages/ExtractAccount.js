import React from 'react'
import moment from 'moment'

import '../App.css'

import {
	Input,
	Checkbox,
	Typography,
	Row,
	Col,
	Card,
	DatePicker,
	Radio,
	Popconfirm,
} from 'antd'
import { TitleFilter, SelectBank, SelectDescription } from '../components'
import {
	PlusCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	CheckCircleOutlined,
} from '@ant-design/icons'
import {
	getExtractData,
	removeTransaction,
	updateTransaction,
	getTransaction,
} from '../api'
import { openNotification, formatDateToUser, prepareValue } from '../utils'

const { Title } = Typography

const descriptionsList = new Set()
class ExtractAccount extends React.Component {
	constructor(props) {
		const today = new Date()
		const actualYear = today.getFullYear()
		const actualMonth = today.getMonth() + 1

		super(props)
		this.state = {
			transactions: [],
			allTransactions: [],
			checked: [],

			filters: {
				year: actualYear,
				month: actualMonth,
				onlyFuture: true,
				onlyPast: false,
				bankId: null,
				description: '',
				detail: '',
			},

			banks: [],
			descriptions: [],
			filtro: true,
			idToEdit: null,
			menu: {
				modalVisible: false,
				transactionToUpdate: null,
			},
		}
		this.handleChange = this.handleChange.bind(this)
		this.submitForm = this.submitForm.bind(this)
		this.processExtractData = this.processExtractData.bind(this)
		this.deleteTransactionChecked = this.deleteTransactionChecked.bind(this)
		this.isChecked = this.isChecked.bind(this)
		this.remover = this.remover.bind(this)
		this.compensateTransaction = this.compensateTransaction.bind(this)
	}

	componentDidUpdate() {
		if (this.props.update) {
			this.processExtractData()
		}
	}

	componentDidMount() {
		this.props.mudaTitulo('Extrato > Contas Corrente')
		this.processExtractData()
	}

	processExtractData() {
		this.props.loading(true)
		return getExtractData('contaCorrente', this.state.filters)
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
						let transactions = extractData.transactionList

						if (state.filters.onlyPast) {
							const today = new Date()
							transactions = transactions.filter(
								(transaction) => new Date(transaction.effectedAt) < today
							)
						}

						state.banks = extractData.banksList
						state.transactions = transactions
						state.allTransactions = extractData.transactionList
						state.descriptions = [...descriptionsList].sort((a, b) =>
							a.localeCompare(b)
						)
						state.checked = state.checked.filter((id) =>
							state.transactions.some((transaction) => transaction._id === id)
						)
						return state
					})
				}
				this.props.loading(false)
			})
			.catch((err) => {
				openNotification('error', 'Erro ao listar os bancos', err.message)
				this.props.loading(false)
			})
	}

	handleChange(event) {
		this.setState((state) => {
			switch (event.target.name) {
				case 'filtro':
					state.filtro = !state.filtro
					state.checked = []
					break

				case 'clearFilter':
					const now = new Date()
					state.transactions = state.allTransactions
					state.filters.year = now.getFullYear()
					state.filters.month = now.getMonth() + 1
					state.filters.bankId = null
					state.filters.description = ''
					state.checked = []
					this.processExtractData()
					break

				case 'name':
					state.name = event.target.value
					break

				case 'isActive':
					state.filters.data.isActive = !state.filters.data.isActive
					break

				case 'bankType':
					state.filters.data.bankType = event.target.value
					break

				case 'year':
					state.filters.year = event.target.value
					state.checked = []
					this.processExtractData()
					break

				case 'month':
					state.filters.month = event.target.value
					state.checked = []
					this.processExtractData()
					break

				case 'timeFilter':
					state.filters.onlyFuture = event.target.value === 'future'
					state.filters.onlyPast = event.target.value === 'past'
					state.checked = []
					this.processExtractData()
					break

				case 'bankId':
					state.filters.bankId = event.target.value
					state.checked = []
					this.processExtractData()
					break

				case 'description':
					state.filters.description = event.target.value
					state.checked = []
					this.processExtractData()
					break

				case 'descriptionList':
					if (event?.target?.value?.length > 0) {
						state.descriptions = event.target.value
						this.processExtractData()
					}
					break

				case 'detail':
					state.filters.detail = event.target.value
					state.checked = []
					this.processExtractData()
					break

				case 'checkbox':
					const id = event.target.value
					if (this.isChecked(id)) {
						this.removeChecked(id)
					} else {
						state.checked.push(id)
					}
					break

				default:
			}
			return state
		})
	}

	removeChecked(id) {
		this.setState((state) => {
			state.checked = state.checked.filter((element) => {
				return element !== id
			})

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
						//TODO: chamar essa função apenas ao finalizar o loop
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

	compensateTransaction(transactionId) {
		return getTransaction(transactionId)
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					let transaction = res.data.data
					transaction.effectedAt = formatDateToUser(res.data.effectedAt)
					transaction.isCompensated = true
					return transaction
				}
			})
			.then((transaction) => {
				return updateTransaction(transaction, transaction._id)
			})
			.then((res) => {
				if (res.data.code === 201 || res.data.code === 202) {
					openNotification(
						'success',
						'Transação atualizada',
						'Transação atualizada com sucesso.'
					)
					this.processExtractData()
				} else {
					openNotification(
						'error',
						'Transação não atualizada',
						`A Transação não pode ser atualizada: ${res?.data?.message}`
					)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Transação não atualizada',
					'Erro interno. Tente novamente mais tarde.'
				)
			})
	}

	submitForm(e) {}

	render() {
		return (
			<div>
				<div>
					<TitleFilter
						handleChange={this.handleChange}
						isFiltered={this.state.filtro}
					/>
					{this.state.filtro && (
						<>
							<Row>
								<Col xs={10}  lg={3}>
									<span style={{ marginRight: '40px' }}>Data:</span>
									<DatePicker
										size='middle'
										picker='month'
										style={{ width: 100 }}
										onChange={(date, dateString) => {
											if (!date) {
												const now = new Date()
												this.setState(
													(state) => ({
														...state,
														filters: {
															...state.filters,
															year: now.getFullYear(),
															month: now.getMonth() + 1,
														},
													}),
													() => this.processExtractData()
												)
												return
											}
											const [year, month] = dateString.split('-')
											this.setState(
												(state) => ({
													...state,
													filters: {
														...state.filters,
														year: parseInt(year, 10),
														month: parseInt(month, 10),
													},
												}),
												() => this.processExtractData()
											)
										}}
										format='YYYY-MM'
										placeholder='Selecione o mês e ano'
										value={
											this.state.filters.year && this.state.filters.month
												? moment(
														`${this.state.filters.year}-${this.state.filters.month}`,
														'YYYY-MM'
												  )
												: null
										}
										inputReadOnly
									/>
								</Col>
								<Col xs={13}  lg={4}>
									<span style={{ marginRight: '15px' }}>Tipo:</span>
									<Radio.Group
										size='middle'
										name='timeFilter'
										value={
											this.state.filters.onlyFuture
												? 'future'
												: this.state.filters.onlyPast
												? 'past'
												: 'all'
										}
										onChange={(e) =>
											this.handleChange({
												target: { name: 'timeFilter', value: e.target.value },
											})
										}
									>
										<Radio.Button
											value='all'
											style={{ marginRight: '5px', padding: '0 7px' }}
										>
											Todos
										</Radio.Button>
										<Radio.Button
											value='future'
											style={{ marginRight: '5px', padding: '0 7px' }}
										>
											Futuro
										</Radio.Button>
										<Radio.Button value='past' style={{ padding: '0 7px' }}>
											Concluído
										</Radio.Button>
									</Radio.Group>
								</Col>
							</Row>
							<br />
							<Row>
								<Col xs={11} lg={3}>
									<span style={{ marginRight: '30px' }}>Banco:</span>
									<SelectBank
										handleChange={this.handleChange}
										bankId={this.state.filters.bankId}
										banks={this.state.banks}
									/>
								</Col>
								<Col xs={12} lg={4}>
									<span style={{ marginRight: '5px' }}>Título:</span>
									<SelectDescription
										lastDescriptions={this.state.descriptions}
										currentDescription={this.state.filters.description}
										handleChange={this.handleChange}
									/>
								</Col>
							</Row>
							<br></br>
							<Row>
								<Col xs={16} lg={6}>
									<span style={{ marginRight: '15px' }}>Detalhes:</span>
									<Input
										placeholder='Detail'
										type='text'
										name='detail'
										size='middle'
										value={this.state.detail}
										onChange={this.handleChange}
										style={{ maxWidth: 300 }}
									/>
								</Col>
							</Row>
						</>
					)}
					<br />
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
									this.props.showModal({ transactionType: 'contaCorrente' })
								}}
							/>
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
										this.setState({
											checked: this.state.transactions.map((t) => t._id),
										})
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
										fontSize: '17px',
									}}
								>
									<EditOutlined
										style={{ cursor: 'pointer', color: '#006400' }}
										onClick={() => {
											this.props.showModal({
												transactionType: 'contaCorrente',
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
									{!element.isCompensated && (
										<Popconfirm
											title='Deseja realmente compensar essa Transação?'
											onConfirm={() => this.compensateTransaction(element._id)}
											okText='Sim'
											cancelText='Não'
										>
											<CheckCircleOutlined
												style={{ cursor: 'pointer', color: '#006400' }}
											/>
										</Popconfirm>
									)}
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
export default ExtractAccount
