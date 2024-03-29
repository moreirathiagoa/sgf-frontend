import React from 'react'

import '../App.css'
import { get } from 'lodash'
import { Input, Typography, Row, Col, Card, Modal, Checkbox } from 'antd'
import {
	TitleFilter,
	SelectYear,
	SelectMonth,
	SelectCategories,
	SelectBank,
	TransactionOptions,
} from '../components'
import {
	PlusCircleOutlined,
	CheckOutlined,
	DeleteOutlined,
} from '@ant-design/icons'
import { getExtractData, removeTransaction, planToPrincipal } from '../api'
import { openNotification, formatDateToUser, prepareValue } from '../utils'

const { Title } = Typography

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
			bank_id: null,
			category_id: null,
			description: '',

			banks: [],
			categories: [],
			filtro: false,
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

					this.setState((state) => {
						state.banks = extractData.banksList
						state.categories = extractData.categoryList
						state.transactions = extractData.transactionList
						state.allTransactions = extractData.transactionList

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
				case 'filtro':
					state.filtro = !state.filtro
					break

				case 'clearFilter':
					state.transactions = state.allTransactions
					state.year = 'Selecione'
					state.month = 'Selecione'
					state.bank_id = null
					state.description = ''
					state.category_id = null
					this.filterList()
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

				case 'year':
					state.year = event.target.value
					this.filterList()
					break

				case 'month':
					state.month = event.target.value
					this.filterList()
					break

				case 'bank_id':
					state.bank_id = event.target.value
					this.filterList()
					break

				case 'category_id':
					state.category_id = event.target.value
					this.filterList()
					break

				case 'description':
					state.description = event.target.value
					this.filterList()
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
		if (window.confirm('Deseja realmente apagar essa Transação?')) {
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
								'A Transação não pode ser removida.'
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
	}

	filterList() {
		this.setState((state) => {
			const transactionFiltered = state.allTransactions.filter(
				(transaction) => {
					let toReturn = true

					if (this.state.bank_id !== null) {
						if (
							transaction.bank_id._id.toString() !==
							this.state.bank_id.toString()
						) {
							toReturn = false
						}
					}

					if (this.state.category_id !== null) {
						if (
							transaction.category_id._id.toString() !==
							this.state.category_id.toString()
						) {
							toReturn = false
						}
					}

					if (this.state.description !== '') {
						const description = transaction.description.toLowerCase()
						const filterDescription = this.state.description.toLowerCase()
						if (!description.includes(filterDescription)) {
							toReturn = false
						}
					}

					if (this.state.year.toString() !== 'Selecione') {
						let now = new Date(transaction.efectedDate)
						const ano = now.getFullYear()

						if (ano.toString() !== this.state.year.toString()) {
							toReturn = false
						}
					}

					if (this.state.month.toString() !== 'Selecione') {
						let now = new Date(transaction.efectedDate)
						const mes = now.getMonth() + 1

						if (mes.toString() !== this.state.month.toString()) {
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
			return state
		})
	}

	remover(id) {
		if (window.confirm('Deseja realmente apagar essa Transação?')) {
			return removeTransaction(id)
				.then((res) => {
					if (res.data.code === 202) {
						openNotification(
							'success',
							'Transação removida',
							'Transação removida com sucesso.'
						)
					} else {
						openNotification(
							'error',
							'Transação não removida',
							'A Transação não pode ser removida.'
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
		} else {
			const promise = new Promise((resolve, reject) => {
				resolve()
			})

			return promise
		}
	}

	toAccount() {
		this.props.loading(true)
		if (window.confirm('Deseja lançar essas transações em Conta Corrente?')) {
			return planToPrincipal(this.state.transactions)
				.then((res) => {
					if (res.data.code === 201 || res.data.code === 202) {
						openNotification(
							'success',
							'Transação atualizadas',
							'Transação atualizadas com sucesso.'
						)
						this.processExtractData()
					} else {
						openNotification(
							'error',
							'Transação não atualizada',
							res.data.message
						)
					}
					this.props.loading(false)
				})
				.catch((err) => {
					openNotification(
						'error',
						'Transação não atualizada',
						'Erro interno. Tente novamente mais tarde.'
					)
					this.props.loading(false)
				})
		}
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
					<TitleFilter
						handleChange={this.handleChange}
						isFiltered={this.state.filtro}
					/>
					{this.state.filtro && (
						<>
							<Row>
								<Col span={8}>
									<span style={{ marginRight: '30px' }}>Ano:</span>
									<SelectYear
										handleChange={this.handleChange}
										year={this.state.year}
									/>
								</Col>
								<Col span={8}>
									<span style={{ marginRight: '30px' }}>Nês:</span>
									<SelectMonth
										handleChange={this.handleChange}
										month={this.state.month}
									/>
								</Col>
							</Row>
							<br />
							<Row>
								<Col span={12}>
									<span style={{ marginRight: '30px' }}>Banco:</span>
									<SelectBank
										handleChange={this.handleChange}
										bank_id={this.state.bank_id}
										banks={this.state.banks}
									/>
								</Col>
								<Col span={12}>
									<span style={{ marginRight: '30px' }}>Categoria:</span>
									<SelectCategories
										handleChange={this.handleChange}
										category_id={this.state.category_id}
										categories={this.state.categories}
									/>
								</Col>
							</Row>
							<br></br>
							<Row>
								<Col span={12}>
									<span style={{ marginRight: '30px' }}>Descrição:</span>
									<Input
										placeholder='Descrição'
										type='text'
										name='description'
										size='md'
										value={this.state.description}
										onChange={this.handleChange}
										style={{ width: 200 }}
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
								style={{ paddingLeft: '10px' }}
								onClick={() => {
									this.props.showModal({ typeTransaction: 'planejamento' })
								}}
							/>
							<span
								style={{ paddingLeft: '15px' }}
								onClick={() => {
									this.toAccount()
								}}
							>
								<CheckOutlined />
							</span>
							<DeleteOutlined
								style={{ paddingLeft: '10px' }}
								onClick={() => {
									this.deleteTransactionChecked()
								}}
							/>
						</Title>
					</div>
					<Modal
						visible={this.state.menu.modalVisible}
						onCancel={this.menuModalClose}
						footer={null}
						title=''
						destroyOnClose={true}
					>
						<TransactionOptions
							element={this.state.menu.transactionToUpdate}
							screenType={'planejamento'}
							showModal={this.props.showModal}
							closeModal={this.menuModalClose}
							remover={this.remover}
							list={this.processExtractData}
						/>
					</Modal>

					{this.state.transactions.map((element) => {
						const transactionValue = prepareValue(
							element.value,
							element.isCompesed
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
								<span>{element.bank_id.name}</span>
								<span
									style={{
										paddingLeft: '20px',
										color: transactionValue.color,
										alignSelf: 'right',
										float: 'right',
									}}
								>
									{transactionValue.value}
								</span>
							</>
						)

						return (
							<Card
								size='small'
								title={title}
								style={{ width: 370, marginBottom: '5px' }}
								key={element._id}
							>
								<span
									onClick={() => {
										this.showMenuModal(element)
									}}
								>
									<Row>
										<Col span={24}>Categoria: {element.category_id.name}</Col>
									</Row>
									<Row>
										<Col span={12}>
											Criação: {formatDateToUser(element.createDate)}
										</Col>
										<Col span={12}>
											Efetivação: {formatDateToUser(element.efectedDate)}
										</Col>
									</Row>
									<Row>
										<Col span={12}>
											Recorrência:{' '}
											{get(element, 'currentRecurrence', '1') +
												'/' +
												get(element, 'finalRecurrence', '1')}
										</Col>
									</Row>
									<Row>
										<Col span={24}>Descrição: {element.description}</Col>
									</Row>
								</span>
							</Card>
						)
					})}
				</div>
			</div>
		)
	}
}
export default ExtractPlan
