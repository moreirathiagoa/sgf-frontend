import React from 'react'

import '../App.css'
import { get } from 'lodash'
import { Redirect } from 'react-router-dom'
import { Input, Typography, Row, Col, Card, Modal } from 'antd'
import {
	TitleFilter,
	SelectCategories,
	SelectBank,
	SelectFacture,
	TransactionOptions,
} from '../components'
import { PlusCircleOutlined, CheckOutlined } from '@ant-design/icons'
import {
	listBanks,
	listTransaction,
	removeTransaction,
	listCategories,
	listFatures,
	payFature,
} from '../api'
import { openNotification, formatDateToUser, formatMoeda } from '../utils'

const { Title } = Typography

class ExtractCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			faturePayed: null,
			transactions: [],
			allTransactions: [],
			bank_id: 'Selecione',
			category_id: 'Selecione',
			fature_id: 'Selecione',
			description: '',
			banks: [],
			categories: [],
			fatures: [],
			filtro: false,
			idToEdit: null,
			menu: {
				modalVisible: false,
				transactionToUpdate: null,
			},
		}
		this.handleChange = this.handleChange.bind(this)
		this.submitForm = this.submitForm.bind(this)
		this.payFature = this.payFature.bind(this)
		this.getListBanks()
		this.getListCategories()
	}

	componentDidUpdate() {
		if (this.props.update) {
			this.list()
		}
	}

	componentDidMount() {
		this.props.mudaTitulo('Extrato Cartões de Crédito')
		this.list()
	}

	list = () => {
		this.props.loading(true)
		listTransaction('cartaoCredito')
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
		listBanks('cartaoCredito')
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

	getListFatures(bank_id) {
		listFatures(bank_id)
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					let state = this.state
					state.fatures = res.data.data
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

	filterList() {
		let state = this.state

		const transactionFiltered = state.allTransactions.filter((transaction) => {
			let toReturn = true

			if (this.state.bank_id.toString() !== 'Selecione') {
				if (
					transaction.bank_id._id.toString() !== this.state.bank_id.toString()
				) {
					toReturn = false
				}
			}

			if (this.state.fature_id.toString() !== 'Selecione') {
				if (
					transaction.fature_id._id.toString() !==
					this.state.fature_id.toString()
				) {
					toReturn = false
				}
			}

			if (this.state.category_id.toString() !== 'Selecione') {
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

			if (toReturn) {
				return transaction
			}
			return null
		})

		state.transactions = transactionFiltered
		this.setState(state)
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
				state.data.isActive = !state.data.isActive
				break

			case 'bankType':
				state.data.bankType = event.target.value
				break

			case 'bank_id':
				state.bank_id = event.target.value
				this.getListFatures(event.target.value)
				this.filterList()
				break

			case 'fature_id':
				state.fature_id = event.target.value
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

			default:
		}
		this.setState(state)
	}

	payFature() {
		if (window.confirm('Deseja realmente fechar essa fatura?')) {
			if (this.state.fature_id !== 'Selecione') {
				payFature(this.state.fature_id)
					.then((res) => {
						if (res.status === 401) {
							localStorage.removeItem('token')
							this.props.verificaLogin()
						} else {
							let state = this.state

							this.props.showModal({
								typeTransaction: 'contaCorrente',
								transactionFatureId: res.data.data._id,
							})

							//state.faturePayed = res.data.data
							this.setState(state)
							openNotification(
								'success',
								'Fatura Paga',
								'Fatura registrada como paga. Registre agora o débito do seu pagamento se necessário.'
							)
						}
					})
					.catch((err) => {
						openNotification(
							'error',
							'Erro interno',
							'Erro ao obter a listagem de Bancos.'
						)
					})
			} else {
				openNotification(
					'error',
					'Fatura não informada',
					'Necessário informar uma fatura.'
				)
			}
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
		if (this.state.faturePayed) {
			return (
				<Redirect
					to={`/transaction/contaCorrente/pagamentoCartao/${this.state.faturePayed._id}`}
				/>
			)
		}

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
								<Col span={12}>
									<span style={{ marginRight: '30px' }}>Banco:</span>
									<SelectBank
										handleChange={this.handleChange}
										bank_id={this.state.bank_id}
										banks={this.state.banks}
									/>
								</Col>
								<Col span={12}>
									<span style={{ marginRight: '30px' }}>Fatura:</span>
									<SelectFacture
										handleChange={this.handleChange}
										fature_id={this.state.fature_id}
										fatures={this.state.fatures}
									/>
								</Col>
							</Row>
							<br />
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
										style={{ width: 150 }}
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
						</>
					)}
					<br />
					<div>
						<Title level={4}>
							Transações
							<PlusCircleOutlined
								style={{ paddingLeft: '10px' }}
								onClick={() => {
									this.props.showModal({ typeTransaction: 'cartaoCredito' })
								}}
							/>
							{this.state.fature_id !== 'Selecione' && (
								<span
									style={{ paddingLeft: '15px' }}
									onClick={() => {
										this.payFature()
									}}
								>
									<CheckOutlined />
								</span>
							)}
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
							screenType={'cartaoCredito'}
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
								onClick={() => {
									this.showMenuModal(element)
								}}
								key={element._id}
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
									<Col span={12}>Fatura: {element.fature_id.name}</Col>
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
							</Card>
						)
					})}
				</div>
			</div>
		)
	}
}
export default ExtractCard
