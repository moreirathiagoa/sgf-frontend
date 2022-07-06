import React from 'react'

import '../App.css'
import { Form, Input, Button, Switch, Row, Col, DatePicker } from 'antd'
import {
	createTransaction,
	updateTransaction,
	getTransactionData,
} from '../api'
import {
	openNotification,
	actualDateToUser,
	formatDateToMoment,
	formatDateToUser,
} from '../utils'
import { SelectCategories, SelectBank } from '.'

class Transaction extends React.Component {
	constructor(props) {
		const transactionType = props.transactionType
		const transactionId = props.transactionId
		const todayDate = actualDateToUser()
		const isCompesed = transactionType === 'contaCorrente' ? true : undefined

		super(props)
		this.state = {
			idToUpdate: transactionId,
			data: {
				efectedDate: todayDate,
				bank_id: 'Selecione',
				category_id: 'Selecione',
				isSimples: false,
				value: null,
				isCompesed: isCompesed,
				typeTransaction: transactionType,
			},
			isCredit: false,
			banks: [],
			categories: [],
			saveExit: null,
			exit: false,
		}
		this.getTransactionData(transactionType, transactionId)

		this.handleChange = this.handleChange.bind(this)
	}

	getTransactionData(transactionType, idTransaction) {
		return getTransactionData(transactionType, idTransaction)
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					const transactionData = res.data
					let state = this.state

					const banks = transactionData.banksList.filter((bank) => {
						return bank.isActive
					})

					state.banks = banks
					state.categories = transactionData.categoryList

					if (transactionData.transactionData) {
						state.data = transactionData.transactionData

						if (transactionData.transactionData.value >= 0) {
							state.isCredit = true
						} else {
							state.data.value = -1 * state.data.value
						}

						state.data.efectedDate = formatDateToUser(
							transactionData.transactionData.efectedDate
						)
					}

					this.setState(state)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Erro interno',
					'Erro ao obter dados da transação.'
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
				this.finalizeForm().then(() => {
					if (!this.state.isCredit) {
						const state = this.state
						state.data.value = state.data.value * -1
						this.setState(state)
					}
				})
				break

			default:
		}
		this.setState(state)
	}

	finalizeForm() {
		this.props.loading(true)
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
					this.props.update()
					this.props.loading(false)
					return 'success'
				} else {
					openNotification(
						'error',
						'Transação não cadastrada',
						res.data.message
					)
					this.props.update()
					this.props.loading(false)
					return 'error'
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Transação não cadastrada',
					'Erro interno. Tente novamente mais tarde.'
				)
				this.props.update()
				this.props.loading(false)
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
					onFinishFailed={() => {}}
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
									value={formatDateToMoment(this.state.data.efectedDate)}
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
