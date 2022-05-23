import React from 'react'

import {
	Table,
	Statistic,
	Modal,
	Input,
	Row,
	Col,
	Typography,
	Select,
} from 'antd'
import '../App.css'
import { getDashboardData, updateBank, bankTransference } from '../api'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { openNotification, prepareValue } from '../utils'

const { Title } = Typography
const { Option } = Select

class DashboardDebit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			banks: [],
			categories: [],
			saldoNotCompensatedCredit: 'Aguarde...',
			saldoNotCompensatedDebit: 'Aguarde...',
			saldoReal: 'Aguarde...',
			saldoLiquido: 'Aguarde...',
			modalSaldoContent: {
				visible: false,
				id: null,
				banco: null,
				saldoManual: null,
			},
			modalTransferenceContent: {
				visible: false,
				originalBankId: null,
				finalBankId: null,

				//TODO: Verificar uma forma melhor de fixar uma categoria
				categoryId: '5ed678b44ccebd0017598daf',
				value: null,
			},
			tableContent: [],
		}
		this.handleChange = this.handleChange.bind(this)
		this.processUpdate()
	}

	componentDidUpdate() {
		if (this.props.update) {
			this.processUpdate()
		}
	}

	componentDidMount() {}

	processUpdate() {
		this.props.loading(true)
		this.props.mudaTitulo('Saldos')

		getDashboardData()
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					const dashboardData = res.data

					let state = this.state
					state.banks = dashboardData.banksList
					state.categories = dashboardData.categoryList
					state.saldoNotCompensatedCredit =
						dashboardData.balanceNotCompensatedCredit
					state.saldoNotCompensatedDebit =
						dashboardData.balanceNotCompensatedDebit
					this.setState(state)
					this.getSaldosGerais()
					this.props.loading(false)
				}
			})
			.catch((err) => {
				openNotification('error', 'Erro ao listar os bancos', err.message)
			})
	}

	handleChange(event) {
		let state = this.state

		switch (event.target.name) {
			case 'saldoManualModal':
				state.modalSaldoContent.saldoManual = event.target.value
				break

			case 'transferenceValue':
				state.modalTransferenceContent.value = event.target.value
				break

			case 'categoryId':
				state.modalTransferenceContent.categoryId = event.target.value
				break

			default:
		}
		this.setState(state)
	}

	columns = () => {
		return [
			{
				title: 'Banco',
				dataIndex: 'banco',
			},
			{
				title: 'Sistema',
				dataIndex: 'saldoSistema',
			},
			{
				title: 'Manual',
				dataIndex: 'saldoManual',
				render: (data) => (
					<span
						style={{ color: data.saldoManual.color }}
						onClick={() => {
							this.showModalSaldo(data)
						}}
					>
						{data.saldoManual.value}
					</span>
				),
			},
			{
				title: '#',
				dataIndex: 'status',
			},
		]
	}

	getSaldosGerais() {
		let state = this.state

		let tableContent = []
		let saldoLiquido = 0
		let saldoReal = 0

		const banks = state.banks.filter((bank) => {
			return bank.isActive
		})

		banks.forEach((bank) => {
			saldoLiquido += bank.saldoSistema

			if (bank.bankType === 'Conta Corrente') {
				saldoReal += bank.saldoSistemaDeduzido
			}

			const saldoSistema = prepareValue(bank.saldoSistemaDeduzido)
			const saldoManual = prepareValue(bank.saldoManual)
			const diference = prepareValue(bank.diference)

			const content = {
				key: bank.id,
				banco: bank.name,
				saldoSistema: (
					<span style={{ color: saldoSistema.color }}>
						{saldoSistema.value}
					</span>
				),
				saldoManual: {
					id: bank.id,
					banco: bank.name,
					saldoManual: saldoManual,
					saldoManualModal: bank.saldoSistemaDeduzido,
				},
				diference: (
					<span style={{ color: diference.color }}>{diference.value}</span>
				),
				status: bank.diference ? (
					<CloseCircleOutlined style={{ color: 'red' }} />
				) : (
					<CheckCircleOutlined style={{ color: 'green' }} />
				),
			}

			tableContent.push(content)
		})

		state.saldoReal = saldoReal
		state.saldoLiquido = saldoLiquido
		state.tableContent = tableContent

		this.setState(state)
	}

	showModalTransference = (data) => {
		let state = this.state
		state.modalTransferenceContent.originalBankId = data.originalBankId
		state.modalTransferenceContent.finalBankId = data.finalBankId
		state.modalTransferenceContent.visible = true
		this.setState(state)
	}

	handleOkTransfer = () => {
		this.props.loading(true)

		bankTransference(this.state.modalTransferenceContent)
			.then((res) => {
				if (res.data.code === 201 || res.data.code === 202) {
					openNotification(
						'success',
						'Transação cadastrada',
						'Transferência exexutada com sucesso'
					)
					this.getListBanks().then(() => {
						this.props.loading(false)
						this.handleCancelTransfer()
					})
				} else {
					openNotification(
						'error',
						'Transação não cadastrada',
						res.data.message
					)
					this.props.loading(false)
				}
			})
			.catch((err) => {
				openNotification('error', 'Transação não cadastrada', err.message)
			})
	}

	handleCancelTransfer = () => {
		let state = this.state
		state.modalTransferenceContent.originalBankId = null
		state.modalTransferenceContent.finalBankId = null
		state.modalTransferenceContent.visible = false
		state.modalTransferenceContent.value = null
		this.setState(state)
	}

	showModalSaldo = (data) => {
		let state = this.state
		state.modalSaldoContent.id = data.id
		state.modalSaldoContent.banco = data.banco
		state.modalSaldoContent.saldoManual = data.saldoManualModal
		state.modalSaldoContent.visible = true
		this.setState(state)
	}

	handleOkSaldo = (e) => {
		const bankToUpdate = {
			manualBalance: e.saldoManual,
		}

		this.props.loading(true)

		updateBank(bankToUpdate, e.id)
			.then((res) => {
				if (res.data.code === 201 || res.data.code === 202) {
					openNotification(
						'success',
						'Saldo atualizado',
						'Saldo atualizado com sucesso.'
					)
					this.getListBanks().then(() => this.props.loading(false))
				} else {
					openNotification(
						'error',
						'Saldo não atualizado',
						'O Saldo não pode ser atualizado.'
					)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Erro ao atualizar saldo do banco',
					err.message
				)
			})

		this.handleCancelSaldo()
	}

	handleCancelSaldo = (e) => {
		let state = this.state
		state.modalSaldoContent.id = null
		state.modalSaldoContent.banco = null
		state.modalSaldoContent.saldoManual = null
		state.modalSaldoContent.visible = false
		this.setState(state)
	}

	render() {
		const saldoNotCompensatedCredit = prepareValue(
			this.state.saldoNotCompensatedCredit
		)
		const saldoNotCompensatedDebit = prepareValue(
			this.state.saldoNotCompensatedDebit
		)
		const saldoReal = prepareValue(this.state.saldoReal)
		const saldoLiquido = prepareValue(this.state.saldoLiquido)

		return (
			<>
				<Modal
					title={this.state.modalSaldoContent.banco}
					visible={this.state.modalSaldoContent.visible}
					onOk={() => {
						this.handleOkSaldo(this.state.modalSaldoContent)
					}}
					onCancel={this.handleCancelSaldo}
				>
					<Row>
						<span style={{ paddingRight: '5px', paddingTop: '3px' }}>
							Informe o saldo atual no Banco:
						</span>
						<Input
							placeholder=''
							name='saldoManualModal'
							size='md'
							type='number'
							value={this.state.modalSaldoContent.saldoManual}
							onChange={this.handleChange}
							style={{ width: 100 }}
						/>
					</Row>
				</Modal>
				<Col style={{ width: '320px' }}>
					<Row style={{ paddingBottom: '10px' }}>
						<Col span={15}>
							<Statistic
								valueStyle={{ color: saldoNotCompensatedCredit.color }}
								title='Previsão de entrada'
								value={saldoNotCompensatedCredit.value}
							/>
						</Col>
						<Col span={8}>
							<Statistic
								valueStyle={{ color: saldoNotCompensatedDebit.color }}
								title='Previsão Saída'
								value={saldoNotCompensatedDebit.value}
							/>
						</Col>
					</Row>
					<Row style={{ paddingBottom: '10px' }}>
						<Col span={15}>
							<Statistic
								valueStyle={{ color: saldoReal.color }}
								title='Saldo Real'
								value={saldoReal.value}
							/>
						</Col>
						<Col span={8}>
							<Statistic
								valueStyle={{ color: saldoLiquido.color }}
								title='Saldo Líquido'
								value={saldoLiquido.value}
							/>
						</Col>
					</Row>
				</Col>

				<Title level={4}>Saldo por Banco</Title>
				<Row>
					<Modal
						title='Transferência entre Bancos'
						visible={this.state.modalTransferenceContent.visible}
						onOk={() => {
							this.handleOkTransfer(this.state.modalTransferenceContent)
						}}
						onCancel={this.handleCancelTransfer}
					>
						<Row>
							<span style={{ paddingRight: '5px', paddingTop: '3px' }}>
								Informe o valor a ser transferido:
							</span>
							<Input
								placeholder=''
								name='transferenceValue'
								size='md'
								type='number'
								value={this.state.modalTransferenceContent.value}
								onChange={this.handleChange}
								style={{ width: 100 }}
							/>
						</Row>
						<Row style={{ padding: '10px' }}>
							<span style={{ paddingRight: '5px', paddingTop: '3px' }}>
								Selecione a Categoria:
							</span>
							<Select
								name='categoryId'
								size='md'
								style={{ width: 150 }}
								value={this.state.modalTransferenceContent.categoryId}
								onSelect={(value) => {
									const event = {
										target: {
											name: 'categoryId',
											value: value,
										},
									}
									this.handleChange(event)
								}}
							>
								{this.state.categories.map((element) => {
									return (
										<Option key={element._id} value={element._id}>
											{element.name}
										</Option>
									)
								})}
							</Select>
						</Row>
					</Modal>
					<Table
						pagination={false}
						columns={this.columns()}
						dataSource={this.state.tableContent}
						size='small'
						expandable={{
							expandedRowRender: (record) => (
								<div>
									<p style={{ margin: 0, paddingBottom: '4px' }}>
										Diferença: {record.diference}
									</p>
									<Select
										name='bank_id'
										size='md'
										style={{ width: 280 }}
										value='Transferência interna entre Bancos'
										onSelect={(value) => {
											const event = {
												originalBankId: record.key,
												finalBankId: value,
											}
											this.showModalTransference(event)
										}}
									>
										{this.state.banks.map((element) => {
											return element.id !== record.key && element.isActive ? (
												<Option key={element.id} value={element.id}>
													{element.name}
												</Option>
											) : (
												''
											)
										})}
									</Select>
								</div>
							),
						}}
					/>
				</Row>
			</>
		)
	}
}
export default DashboardDebit
