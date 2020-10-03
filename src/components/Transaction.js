import React from 'react'
import '../App.css'
import { Form, Input, Button, Switch, Row, Col, DatePicker } from 'antd'
import {
	createTransaction,
	updateTransaction,
	listBanks,
	listCategories,
	getTransaction,
	getFature,
} from '../api'
import {
	openNotification,
	actualDateToUser,
	formatDateToMoment,
	formatDateToUser,
} from '../utils'
import { SelectCategories, SelectBank, SelectFacture } from '.'

class Transaction extends React.Component {
	constructor(props) {
		const transactionType = props.transactionType
		const transactionId = props.transactionId

		super(props)

		this.state = {
			idToUpdate: transactionId,
			data: {
				efectedDate: actualDateToUser(),
				bank_id: 'Selecione',
				category_id: 'Selecione',
				isSimples: false,
				isCompesed: transactionType === 'contaCorrente' ? true : undefined,
				typeTransaction: transactionType,
			},
			isCredit: false,
			banks: [],
			categories: [],
			fatures: [],
			saveExit: null,
			exit: false,
		}

		this.handleChange = this.handleChange.bind(this)
	}

	componentDidMount() {
		const transactionType = this.props.transactionType
		const transactionId = this.props.transactionId
		const transactionFatureId = this.props.transactionFatureId

		let now = new Date()

		let state = this.state

		now.setDate('10')
		now.setDate(now.getDate() - 30)
		for (let i = 0; i <= 12; i++) {
			const mes = now.getMonth() + 1
			const ano = now.getFullYear()
			let mesFinal = '00' + mes
			mesFinal = mesFinal.substr(mesFinal.length - 2)
			let fatura = {
				_id: ano + '/' + mesFinal,
				name: ano + '/' + mesFinal,
			}

			state.fatures.push(fatura)
			now.setDate(now.getDate() + 30)
		}
		this.setState(state)

		this.getListCategories()

		this.getListBanks(transactionType)

		if (transactionId) {
			this.getTransactionToUpdate(transactionId)
		}

		if (transactionFatureId) {
			this.getDataFromFature(transactionFatureId)
		}
	}

	getTransactionToUpdate(idTransaction) {
		getTransaction(idTransaction)
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					let state = this.state
					state.data = res.data.data

					if (res.data.data.fature_id)
						state.data.fature = res.data.data.fature_id.name

					state.data.efectedDate = formatDateToUser(res.data.data.efectedDate)

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

	getListBanks(typeTransaction) {
		return listBanks(typeTransaction)
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
					'Erro ao obter a listagem de Transações.'
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

	getDataFromFature(fatureId) {
		getFature(fatureId)
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					const fatureInformation = res.data.data
					let state = this.state
					state.data.description = `Pg. Fatura ${fatureInformation.name} - ${fatureInformation.bank_id.name}`
					state.data.value = fatureInformation.fatureBalance
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

	handleChange(event) {
		let state = this.state

		switch (event.target.name) {
			case 'isCompensated':
				state.data.isCompesed = !state.data.isCompesed
				break

			case 'efectedDate':
				state.data.efectedDate = event.target.value
				break

			case 'description':
				state.data.description = event.target.value
				break

			case 'value':
				state.data.value = event.target.value
				break

			case 'currentRecurrence':
				state.data.currentRecurrence = event.target.value
				break

			case 'finalRecurrence':
				state.data.finalRecurrence = event.target.value
				break

			case 'bank_id':
				state.data.bank_id = event.target.value
				break

			case 'category_id':
				state.data.category_id = event.target.value
				break

			case 'fature_id':
				state.data.fature = event.target.value
				break

			case 'isSimples':
				state.data.isSimples = !state.data.isSimples
				break

			case 'isCredit':
				state.isCredit = !state.isCredit
				break

			case 'salvarSair':
				this.finalizeForm().then((res) => {
					if (res === 'success') this.props.handleClose()
				})
				break

			case 'salvar':
				this.finalizeForm()
				break

			default:
		}
		this.setState(state)
	}

	finalizeForm() {
		if (!this.state.isCredit) {
			const state = this.state
			state.data.value = state.data.value * -1
			this.setState(state)
		}

		if (this.state.idToUpdate) {
			return this.atualizar()
		} else {
			return this.cadastrar()
		}
	}

	cadastrar() {
		return createTransaction(this.state.data)
			.then((res) => {
				if (res.data.code === 201 || res.data.code === 202) {
					openNotification(
						'success',
						'Transação cadastrada',
						'Transação cadastrada com sucesso.'
					)
					return 'success'
				} else {
					openNotification(
						'error',
						'Transação não cadastrada',
						res.data.message
					)
					return 'error'
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Transação não cadastrada',
					'Erro interno. Tente novamente mais tarde.'
				)
				return 'error'
			})
	}

	atualizar() {
		return updateTransaction(this.state.data, this.state.idToUpdate)
			.then((res) => {
				if (res.data.code === 201 || res.data.code === 202) {
					openNotification(
						'success',
						'Transação atualizada',
						'Transação atualizada com sucesso.'
					)
					return 'success'
				} else {
					openNotification(
						'error',
						'Transação não atualizada',
						'A Transação não pode ser atualizada.'
					)
					return 'error'
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Transação não cadastrada',
					'Erro interno. Tente novamente mais tarde.'
				)
				return 'error'
			})
	}

	render() {
		return (
			<div>
				<Form
					labelCol={{ span: 5 }}
					wrapperCol={{ span: 14 }}
					layout='horizontal'
					size={'small'}
					name='basic'
					initialValues={{ remember: true }}
					onFinishFailed={() => {
						console.log('falhou')
					}}
				>
					<Form.Item label='Banco'>
						<SelectBank
							handleChange={this.handleChange}
							bank_id={this.state.data.bank_id}
							banks={this.state.banks}
						/>
					</Form.Item>

					<Form.Item label='Categoria'>
						<SelectCategories
							handleChange={this.handleChange}
							category_id={this.state.data.category_id}
							categories={this.state.categories}
						/>
					</Form.Item>

					<Form.Item label='Data'>
						<Row>
							<Col span={12}>
								<DatePicker
									format={'DD/MM/YYYY'}
									name='efectedDate'
									size='md'
									defaultValue={formatDateToMoment(this.state.data.efectedDate)}
									onChange={(date, dateString) => {
										const event = {
											target: {
												name: 'efectedDate',
												value: dateString,
											},
										}
										this.handleChange(event)
									}}
								/>
							</Col>
							<Col span={10}>
								{this.state.data.typeTransaction === 'contaCorrente' && (
									<>
										<span
											style={{ padding: '0 10px' }}
											onClick={this.handleChange}
										>
											<Switch
												name='isCompensated'
												checked={this.state.data.isCompesed}
												size='md'
											/>
										</span>
										<span style={{ color: '#ccc' }}>
											{this.state.data.isCompesed ? 'Compensado' : 'Programado'}
										</span>
									</>
								)}
							</Col>
						</Row>
					</Form.Item>

					<Form.Item label='Valor'>
						<Row>
							<Col span={10}>
								<Input
									placeholder=''
									type='number'
									name='value'
									size='md'
									value={this.state.data.value}
									onChange={this.handleChange}
									style={{ width: 100 }}
								/>
							</Col>
							<Col span={10}>
								<>
									<span
										style={{ padding: '0 10px' }}
										onClick={this.handleChange}
									>
										<Switch
											name='isCredit'
											checked={this.state.isCredit}
											size='md'
										/>
									</span>
									<span style={{ color: '#ccc' }}>
										{this.state.isCredit ? 'Crédito' : 'Débito'}
									</span>
								</>
							</Col>
						</Row>
					</Form.Item>

					<Form.Item label='Descrição'>
						<Input
							placeholder=''
							type='text'
							name='description'
							size='md'
							value={this.state.data.description}
							onChange={this.handleChange}
							style={{ width: 350 }}
						/>
					</Form.Item>
					{this.state.data.typeTransaction === 'cartaoCredito' && (
						<Form.Item label='Fatura'>
							<SelectFacture
								handleChange={this.handleChange}
								fature_id={this.state.data.fature}
								fatures={this.state.fatures}
							/>
						</Form.Item>
					)}
					<Form.Item label='Recorrência'>
						<Row>
							{this.state.idToUpdate && (
								<Col span={6}>
									<Input
										placeholder='Atual'
										type='number'
										name='currentRecurrence'
										size='md'
										value={this.state.data.currentRecurrence}
										onChange={this.handleChange}
										style={{ width: 60 }}
									/>
								</Col>
							)}
							<Col span={8}>
								<Input
									placeholder='Final'
									type='number'
									name='finalRecurrence'
									size='md'
									value={this.state.data.finalRecurrence}
									onChange={this.handleChange}
									style={{ width: 60 }}
								/>
							</Col>
							<Col span={12}>
								<span style={{ padding: '0 10px' }} onClick={this.handleChange}>
									<Switch
										name='isSimples'
										checked={this.state.data.isSimples}
										size='md'
									/>
								</span>
								<span style={{ color: '#ccc' }}>
									{this.state.data.isSimples ? 'Simples' : 'Completa'}
								</span>
							</Col>
						</Row>
					</Form.Item>

					<Form.Item label='Ação'>
						<Row>
							{!this.state.idToUpdate && (
								<Col span={8}>
									<Button
										className='btn-fill'
										size='lg'
										htmlType='submit'
										name='salvar'
										onClick={() => {
											const event = {
												target: {
													name: 'salvar',
													value: true,
												},
											}
											this.handleChange(event)
										}}
									>
										Salvar
									</Button>
								</Col>
							)}
							<Col span={8}>
								<Button
									className='btn-fill'
									size='lg'
									type='primary'
									htmlType='submit'
									name='salvarSair'
									onClick={() => {
										const event = {
											target: {
												name: 'salvarSair',
												value: true,
											},
										}
										this.handleChange(event)
									}}
								>
									Salvar e Sair
								</Button>
							</Col>
						</Row>
					</Form.Item>
				</Form>
			</div>
		)
	}
}

export default Transaction
