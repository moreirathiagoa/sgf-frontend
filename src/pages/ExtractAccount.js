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
	Modal,
	DatePicker,
	Radio,
} from 'antd'
import {
	TitleFilter,
	SelectBank,
	SelectDescription,
	TransactionOptions,
} from '../components'
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { getExtractData, removeTransaction } from '../api'
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
				onlyFuture: true, // Alterado para carregar como futuro
				onlyPast: false,
				bankId: null,
				description: '',
				detail: '',
			},

			banks: [],
			descriptions: [],
			filtro: true, // Alterado para começar aberto
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

						// Aplicar filtro "Passado"
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
					state.checked = [] // Limpar seleções
					break

				case 'clearFilter':
					const now = new Date()
					state.transactions = state.allTransactions
					state.filters.year = now.getFullYear()
					state.filters.month = now.getMonth() + 1
					state.filters.bankId = null
					state.filters.description = ''
					state.checked = [] // Limpar seleções
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
					state.checked = [] // Limpar seleções
					this.processExtractData()
					break

				case 'month':
					state.filters.month = event.target.value
					state.checked = [] // Limpar seleções
					this.processExtractData()
					break

				case 'timeFilter':
					state.filters.onlyFuture = event.target.value === 'future'
					state.filters.onlyPast = event.target.value === 'past'
					state.checked = [] // Limpar seleções
					this.processExtractData()
					break

				case 'bankId':
					state.filters.bankId = event.target.value
					state.checked = [] // Limpar seleções
					this.processExtractData()
					break

				case 'description':
					state.filters.description = event.target.value
					state.checked = [] // Limpar seleções
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
					state.checked = [] // Limpar seleções
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
		} else {
			const promise = new Promise((resolve, reject) => {
				resolve()
			})

			return promise
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
								<Col xs={11} sm={12} md={6} lg={3}>
									<span style={{ marginRight: '20px' }}>Data:</span>
									<DatePicker
										size='small' // Alterado para 'small' para reduzir a altura
										picker='month'
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
													() => this.processExtractData() // Chamar após atualizar o estado
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
												() => this.processExtractData() // Chamar após atualizar o estado
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
										inputReadOnly // Adicionado para evitar o teclado no celular
									/>
								</Col>
								<Col xs={13} sm={12} md={6} lg={3}>
										<span style={{ marginRight: '20px' }}>Tipo:</span>
										<Radio.Group
											size="small"
											name="timeFilter"
											value={this.state.filters.onlyFuture ? 'future' : this.state.filters.onlyPast ? 'past' : 'all'}
											onChange={(e) => this.handleChange({ target: { name: 'timeFilter', value: e.target.value } })}
										>
											<Radio.Button value="all" style={{ marginRight: '4px' }}>Todos</Radio.Button>
											<Radio.Button value="future" style={{ marginRight: '4px' }}>Futuro</Radio.Button>
											<Radio.Button value="past">Passado</Radio.Button>
										</Radio.Group>
								</Col>
							</Row>
							<br />
							<Row>
								<Col xs={11} sm={12} md={6} lg={3}>
									<span style={{ marginRight: '15px' }}>Banco:</span>
									<SelectBank
										handleChange={this.handleChange}
										bankId={this.state.filters.bankId}
										banks={this.state.banks}
									/>
								</Col>
								<Col span={12}>
									<span style={{ marginRight: '15px' }}>Título:</span>
									<SelectDescription
										lastDescriptions={this.state.descriptions}
										currentDescription={this.state.filters.description}
										handleChange={this.handleChange}
									/>
								</Col>
							</Row>
							<br></br>
							<Row>
								<Col span={12}>
									<span style={{ marginRight: '15px' }}>Detalhes:</span>
									<Input
										placeholder='Detail'
										type='text'
										name='detail'
										size='small'
										value={this.state.detail}
										onChange={this.handleChange}
										style={{ width: 250 }}
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
									this.props.showModal({ transactionType: 'contaCorrente' })
								}}
							/>
							<DeleteOutlined
								style={{ paddingLeft: '10px' }}
								onClick={() => {
									this.deleteTransactionChecked()
								}}
							/>
							<Checkbox
								style={{ marginLeft: '10px' }}
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
					<Modal
						open={this.state.menu.modalVisible}
						onCancel={this.menuModalClose}
						footer={null}
						title=''
						destroyOnClose={true}
					>
						<TransactionOptions
							element={this.state.menu.transactionToUpdate}
							screenType={'contaCorrente'}
							showModal={this.props.showModal}
							closeModal={this.menuModalClose}
							remover={this.remover}
							list={this.processExtractData}
						/>
					</Modal>

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
								</span>
							</Card>
						)
					})}
				</div>
			</div>
		)
	}
}
export default ExtractAccount
