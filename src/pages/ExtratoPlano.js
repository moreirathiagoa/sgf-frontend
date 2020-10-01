import React from 'react'
import '../App.css'
import { Link, Redirect } from 'react-router-dom'
import {
	Input,
	Collapse,
	Menu,
	Dropdown,
	Descriptions,
	Typography,
	Row,
	Col,
} from 'antd'
import {
	TitleFilter,
	SelectYear,
	SelectMonth,
	SelectCategories,
	SelectBank,
} from '../components'
import {
	MenuOutlined,
	PlusCircleOutlined,
	CheckOutlined,
} from '@ant-design/icons'
import {
	listBanks,
	listTransaction,
	removeTransaction,
	listCategories,
	planToPrincipal,
} from '../api'
import { openNotification, formatDateToUser, formatMoeda } from '../utils'

const { Panel } = Collapse
const { Title } = Typography

function callback(key) {
	//console.log(key);
}

class ExtractPlan extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			transations: [],
			allTransations: [],

			year: '',
			month: '',
			notCompensed: false,
			bank_id: 'Selecione',
			category_id: 'Selecione',
			description: '',

			banks: [],
			categories: [],
			filtro: false,
			idToEdit: null,
		}
		this.handleChange = this.handleChange.bind(this)
		this.submitForm = this.submitForm.bind(this)
		this.toAccount = this.toAccount.bind(this)
		this.getListBanks()
		this.getListCategories()
	}

	componentDidMount() {
		this.props.mudaTitulo('Extrato Planejamentos Futuros')
		this.list()
	}

	list = () => {
		this.props.loading(true)
		listTransaction('planejamento')
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					let state = this.state
					state.transations = res.data.data
					state.allTransations = res.data.data
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
				state.transations = state.allTransations
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

			default:
		}
		this.setState(state)
	}

	filterList() {
		let state = this.state

		const transationFiltred = state.allTransations.filter((transation) => {
			let toReturn = true

			if (this.state.bank_id.toString() !== 'Selecione') {
				if (
					transation.bank_id._id.toString() !== this.state.bank_id.toString()
				) {
					toReturn = false
				}
			}

			if (this.state.category_id.toString() !== 'Selecione') {
				if (
					transation.category_id._id.toString() !==
					this.state.category_id.toString()
				) {
					toReturn = false
				}
			}

			if (this.state.description !== '') {
				const description = transation.description.toLowerCase()
				const filterDescription = this.state.description.toLowerCase()
				if (!description.includes(filterDescription)) {
					toReturn = false
				}
			}

			if (this.state.year !== '') {
				let now = new Date(transation.efectedDate)
				const ano = now.getFullYear()

				if (ano.toString() !== this.state.year.toString()) {
					toReturn = false
				}
			}

			if (this.state.month !== '') {
				let now = new Date(transation.efectedDate)
				const mes = now.getMonth() + 1

				if (mes.toString() !== this.state.month.toString()) {
					toReturn = false
				}
			}

			if (toReturn) {
				return transation
			}
			return null
		})

		state.transations = transationFiltred
		this.setState(state)
	}

	remover(id) {
		if (window.confirm('Deseja realmente apagar essa Transação?')) {
			removeTransaction(id)
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
	}

	editInit(idTransaction) {
		this.setState({ idToEdit: idTransaction })
	}

	toAccount() {
		if (window.confirm('Deseja lançar essas transações em Conta Corrente?')) {
			planToPrincipal(this.state.transations)
				.then((res) => {
					if (res.data.code === 201 || res.data.code === 202) {
						openNotification(
							'success',
							'Transação atualizadas',
							'Transação atualizadas com sucesso.'
						)
						this.list()
					} else {
						openNotification(
							'error',
							'Transação não atualizada',
							res.data.message
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
	}

	submitForm(e) {}

	menu = (element) => (
		<Menu>
			<Menu.Item onClick={() => this.remover(element._id)}>Apagar</Menu.Item>
			<Menu.Item onClick={() => this.editInit(element._id)}>Editar</Menu.Item>
		</Menu>
	)

	render() {
		if (this.state.idToEdit) {
			return (
				<Redirect to={'/transaction/planejamento/' + this.state.idToEdit} />
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
								<Col span={8}>
									<span style={{ marginRight: '30px' }}>Ano:</span>
									<SelectYear handleChange={this.handleChange} />
								</Col>
								<Col span={8}>
									<span style={{ marginRight: '30px' }}>Nês:</span>
									<SelectMonth handleChange={this.handleChange} />
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
					<Row>
						<Title level={4}>
							Transações
							<Link
								style={{ paddingLeft: '10px' }}
								to='/transaction/planejamento'
							>
								<PlusCircleOutlined />
							</Link>
							<span
								style={{ paddingLeft: '15px' }}
								onClick={() => {
									this.toAccount()
								}}
							>
								<CheckOutlined />
							</span>
						</Title>
						<Col span={24}>
							<Collapse onChange={callback} expandIconPosition='left'>
								{this.state.transations.map((element) => {
									const resume = (element, action) => {
										let color = 'green'
										let value = element.value
										if (element.value < 0) {
											color = 'red'
											value = -1 * element.value
										}
										return (
											<div style={{ fontSize: '12px' }}>
												<Row>
													<Col span={4}>
														<span>{formatDateToUser(element.efectedDate)}</span>
													</Col>
													<Col span={11}>
														<span style={{ paddingLeft: '22px' }}>
															{element.bank_id.name}
														</span>
													</Col>
													<Col span={6}>
														<span
															style={{
																paddingLeft: '20px',
																color: color,
																alignSelf: 'right',
															}}
														>
															{formatMoeda(value)}
														</span>
													</Col>
													<Col span={3}>
														<span style={{ float: 'right' }}>
															<Dropdown
																overlay={this.menu(element)}
																placement='bottomRight'
																onClick={(event) => {
																	event.stopPropagation()
																}}
															>
																<MenuOutlined />
															</Dropdown>
														</span>
													</Col>
												</Row>
											</div>
										)
									}
									return (
										<Panel
											header={resume(element, this.genExtra)}
											key={element._id}
										>
											<Descriptions>
												<Descriptions.Item label='Categoria'>
													{element.category_id.name}
												</Descriptions.Item>
												<Descriptions.Item label='Data Criação'>
													{formatDateToUser(element.createDate)}
												</Descriptions.Item>
												<Descriptions.Item label='Data Efetivação'>
													{formatDateToUser(element.efectedDate)}
												</Descriptions.Item>
												<Descriptions.Item label='Status'>
													{element.isCompesed ? 'Compensado' : 'Não compensado'}
												</Descriptions.Item>
												{element.currentRecurrence && (
													<Descriptions.Item label='Recorrência'>
														{element.currentRecurrence +
															'/' +
															element.finalRecurrence}
													</Descriptions.Item>
												)}
												<Descriptions.Item label='Descrição'>
													{element.description}
												</Descriptions.Item>
											</Descriptions>
										</Panel>
									)
								})}
							</Collapse>
						</Col>
					</Row>
				</div>
			</div>
		)
	}
}
export default ExtractPlan
