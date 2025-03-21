import React from 'react'

import { clone } from 'lodash'
import '../App.css'
import {
	Form,
	Input,
	InputNumber,
	Button,
	Switch,
	Row,
	Col,
	DatePicker,
} from 'antd'
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
	formatNumber,
} from '../utils'
import { SelectDescription, SelectBank } from '../components'

class Transaction extends React.Component {
	constructor(props) {
		super(props)
		const transactionType = props.transactionType
		const transactionId = props.transactionId
		const bank = props.bank || null
		const amount =
			bank?.diference < 0 ? bank?.diference * -1 : bank?.diference || null
		const isCredit = bank?.diference < 0
		const todayDate = actualDateToUser()
		const isCompensated = transactionType === 'contaCorrente' ? true : undefined

		this.state = {
			idToUpdate: transactionId,
			data: {
				effectedAt: todayDate,
				isSimples: true,
				value: amount,
				bankId: bank?.id || null,
				description: bank ? 'Consolidação de Saldo' : '',
				isCompensated: isCompensated,
				transactionType: transactionType,
			},
			isCredit: isCredit,
			banks: [],
			lastDescriptions: [],
			saveExit: null,
			exit: false,
		}
		this.handleChange = this.handleChange.bind(this)
		this.getTransactionData(transactionType, transactionId)
	}

	getTransactionData(transactionType, idTransaction) {
		return getTransactionData(transactionType, idTransaction)
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					const transactionData = res.data
					this.setState((state) => {
						const banks = transactionData.banksList.filter((bank) => {
							return bank.isActive
						})

						state.banks = banks
						state.lastDescriptions = transactionData.lastDescriptions

						if (transactionData.transactionData) {
							state.data = transactionData.transactionData

							if (transactionData.transactionData.value >= 0) {
								state.isCredit = true
							} else {
								state.data.value = -1 * state.data.value
							}

							state.data.effectedAt = formatDateToUser(
								transactionData.transactionData.effectedAt
							)
						}

						return state
					})
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
		this.setState((state) => {
			switch (event.target.name) {
				case 'isCompensated':
					state.data.isCompensated = !state.data.isCompensated
					break

				case 'effectedAt':
					state.data.effectedAt = event.target.value

					const dateList = event?.target?.value?.split('/')
					if (dateList) {
						const isoDate = `${dateList[2]}-${dateList[1]}-${dateList[0]}`
						if (new Date(isoDate).getTime() > new Date().getTime()) {
							state.data.isCompensated = false
						} else {
							state.data.isCompensated = true
						}
					}
					break

				case 'description':
					state.data.description = event.target.value
					break

				case 'descriptionList':
					if (event?.target?.value?.length > 0) {
						state.lastDescriptions = event.target.value
					}
					break

				case 'detail':
					state.data.detail = event.target.value
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

				case 'bankId':
					state.data.bankId = event.target.value
					break

				case 'isCredit':
					state.isCredit = !state.isCredit
					break

				default:
			}

			return state
		})
	}

	finalizeForm(type) {
		this.props.loading(true)

		let data = clone(this.state.data)

		if (!this.state.isCredit) {
			data.value = data.value * -1
		}

		if (this.state.idToUpdate) {
			this.updateTransaction(data).then((res) => {
				if (res === 'success' && type === 'salvarSair') this.props.handleClose()
			})
		} else {
			this.createTransaction(data).then((res) => {
				if (res === 'success' && type === 'salvarSair') this.props.handleClose()
			})
		}
	}

	createTransaction(data) {
		return createTransaction(data)
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

	updateTransaction(data) {
		return updateTransaction(data, this.state.idToUpdate)
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
						`A Transação não pode ser atualizada: ${res.data.message}`
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
					<Form.Item label='Valor'>
						<Row>
							<Col span={10}>
								<InputNumber
									placeholder='0,00'
									precision={2}
									formatter={(value) => formatNumber(value, ',')}
									value={Number(this.state.data.value)
										.toFixed(2)
										.replace('.', ',')}
									onChange={(value) => {
										const event = {
											target: {
												name: 'value',
												value: value / 100,
											},
										}
										this.handleChange(event)
									}}
									style={{ width: 100, height: 30 }}
									inputMode='numeric'
								/>
							</Col>
						</Row>
					</Form.Item>
					<Form.Item label='Tipo'>
						<Row>
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

					<Form.Item label='Data'>
						<Row>
							<Col span={12}>
								<DatePicker
									format={'DD/MM/YYYY'}
									name='effectedAt'
									size='md'
									value={formatDateToMoment(this.state.data.effectedAt)}
									onChange={(date, dateString) => {
										const event = {
											target: {
												name: 'effectedAt',
												value: dateString,
											},
										}
										this.handleChange(event)
									}}
								/>
							</Col>
						</Row>
					</Form.Item>
					{this.state.data.transactionType === 'contaCorrente' && (
						<Form.Item label='Status'>
							<Row>
								<Col span={15}>
									<>
										<span
											style={{ padding: '0 10px' }}
											onClick={this.handleChange}
										>
											<Switch
												name='isCompensated'
												checked={this.state.data.isCompensated}
												size='md'
											/>
										</span>
										<span style={{ color: '#ccc' }}>
											{this.state.data.isCompensated
												? 'Compensado'
												: 'Programado'}
										</span>
									</>
								</Col>
							</Row>
						</Form.Item>
					)}

					<Form.Item label='Banco'>
						<SelectBank
							handleChange={this.handleChange}
							bankId={this.state.data.bankId}
							banks={this.state.banks}
						/>
					</Form.Item>

					<Form.Item label='Título'>
						<SelectDescription
							lastDescriptions={this.state.lastDescriptions}
							currentDescription={this.state.data.description}
							handleChange={this.handleChange}
							width={300}
						/>
					</Form.Item>

					<Form.Item label='Detalhes'>
						<Input
							placeholder='Informe um detalhamento'
							type='text'
							name='detail'
							size='md'
							value={this.state.data.detail}
							onChange={this.handleChange}
							style={{ width: 350 }}
						/>
					</Form.Item>

					<Form.Item label='Recorrência'>
						<Row>
							<Col span={8}>
								<Input
									placeholder='Qtd'
									type='number'
									name='finalRecurrence'
									size='md'
									value={this.state.data.finalRecurrence}
									onChange={this.handleChange}
									style={{ width: 80 }}
									inputMode='numeric'
								/>
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
										onClick={() => this.finalizeForm('salvar')}
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
									onClick={() => this.finalizeForm('salvarSair')}
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
