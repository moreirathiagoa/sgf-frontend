import React from 'react'

import '../App.css'
import { get } from 'lodash'

import { Input, Checkbox, Typography, Row, Col, Card, Modal } from 'antd'
import {
	TitleFilter,
	SelectYear,
	SelectMonth,
	SelectCategories,
	SelectBank,
	TransactionOptions,
} from '../components'
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import {
	listBanks,
	listTransaction,
	removeTransaction,
	listCategories,
} from '../api'
import { openNotification, formatDateToUser, formatMoeda } from '../utils'

const { Title } = Typography

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
				onlyFuture: false,
				bank_id: 'Selecione',
				category_id: 'Selecione',
				description: '',
			},

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
	}

	componentDidUpdate() {
		if (this.props.update) {
			this.list()
		}
	}

	componentDidMount() {
		this.props.mudaTitulo('Extrato Contas Corrente')
		this.getListBanks()
		this.getListCategories()
		this.list()
	}

	list = () => {
		this.props.loading(true)
		return listTransaction('contaCorrente', this.state.filters)
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					let state = this.state
					state.transactions = res.data.data
					state.allTransactions = res.data.data
					this.setState(state)
				}
				this.props.loading(false)
			})
			.catch((err) => {
				openNotification(
					'error',
					'Erro ao listar',
					'Erro interno. Tente novamente mais tarde.'
				)
				this.props.loading(false)
			})
	}

	getListBanks() {
		listBanks()
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					let state = this.state
					state.banks = res.data.data
					this.setState(state)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Erro interno',
					'Erro ao obter a listagem de Bancos.'
				)
			})
	}

	getListCategories() {
		listCategories()
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					let state = this.state
					state.categories = res.data.data
					this.setState(state)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Erro ao listar',
					'Erro interno. Tente novamente mais tarde.'
				)
			})
	}

	handleChange(event) {
		let state = this.state

		switch (event.target.name) {
			case 'filtro':
				state.filtro = !state.filtro
				break

			case 'clearFilter':
				state.transactions = state.allTransactions
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
				this.list()
				break

			case 'month':
				state.filters.month = event.target.value
				this.list()
				break

			case 'notCompensated':
				state.filters.onlyFuture = !state.filters.onlyFuture
				this.list()
				break

			case 'bank_id':
				state.filters.bank_id = event.target.value
				this.list()
				break

			case 'category_id':
				state.filters.category_id = event.target.value
				this.list()
				break

			case 'description':
				state.filters.description = event.target.value
				this.list()
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
		this.setState(state)
	}

	removeChecked(id) {
		const state = this.state

		state.checked = state.checked.filter((element) => {
			return element !== id
		})

		this.setState(state)
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
							this.list()
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

	submitForm(e) {}

	showMenuModal = (data) => {
		if (this.state.menu.modalVisible !== data) {
			let state = this.state
			state.menu.modalVisible = true
			state.menu.transactionToUpdate = data
			this.setState(state)
		}
	}

	menuModalClose = (e) => {
		let state = this.state
		state.menu.modalVisible = false
		this.setState(state)
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
										year={this.state.filters.year}
									/>
								</Col>
								<Col span={8}>
									<span style={{ marginRight: '30px' }}>Nês:</span>
									<SelectMonth
										handleChange={this.handleChange}
										month={this.state.filters.month}
									/>
								</Col>
								<Col span={8}>
									<span style={{ marginRight: '30px' }}>Tipo:</span>
									<Checkbox
										name='notCompensated'
										checked={this.state.filters.onlyFuture}
										onClick={this.handleChange}
									>
										Futuros
									</Checkbox>
								</Col>
							</Row>
							<br />
							<Row>
								<Col span={12}>
									<span style={{ marginRight: '30px' }}>Banco:</span>
									<SelectBank
										handleChange={this.handleChange}
										bank_id={this.state.filters.bank_id}
										banks={this.state.banks}
									/>
								</Col>
								<Col span={12}>
									<span style={{ marginRight: '30px' }}>Categoria:</span>
									<SelectCategories
										handleChange={this.handleChange}
										category_id={this.state.filters.category_id}
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
										value={this.state.filters.description}
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
									this.props.showModal({ typeTransaction: 'contaCorrente' })
								}}
							/>
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
							screenType={'contaCorrente'}
							showModal={this.props.showModal}
							closeModal={this.menuModalClose}
							remover={this.remover}
							list={this.list}
						/>
					</Modal>

					{this.state.transactions.map((element) => {
						let color = 'green'
						let value = element.value

						if (element.value < 0) {
							color = 'red'
							value = -1 * element.value
						}
						if (!element.isCompesed) {
							value = `[ ${formatMoeda(value)} ]`
						} else {
							value = formatMoeda(value)
						}
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
										color: color,
										alignSelf: 'right',
										float: 'right',
									}}
								>
									{value}
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
export default ExtractAccount
