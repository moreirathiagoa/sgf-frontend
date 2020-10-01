import React from 'react'
import { Table, Statistic, Modal, Input, Row, Col, Typography } from 'antd'
import '../App.css'
import {
	updateBank,
	getSaldosNaoCompensadoCredit,
	getSaldosNaoCompensadoDebit,
	listBanksDashboard,
} from '../api'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { openNotification, formatMoeda } from '../utils'

const { Title } = Typography

class DashboardDebit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			banks: [],
			saldoNotCompensatedCredit: 'Aguarde...',
			saldoNotCompensatedDebit: 'Aguarde...',
			saldoReal: 'Aguarde...',
			saldoLiquido: 'Aguarde...',
			modalContent: {
				id: null,
				banco: null,
				saldoManual: null,
			},
			tableContent: [],
		}
		this.handleChange = this.handleChange.bind(this)
	}

	componentDidUpdate() {
		//console.log('update')
	}

	componentDidMount() {
		this.props.mudaTitulo('Dashboard Débito')
		this.getListBanks()
		this.initSaldoNaoCompensadoCredit()
		this.initSaldoNaoCompensadoDebit()
	}

	getListBanks() {
		listBanksDashboard()
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					let state = this.state
					state.banks = res.data.data
					this.setState(state)
					this.getSaldosGerais()
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

	initSaldoNaoCompensadoCredit() {
		getSaldosNaoCompensadoCredit()
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					let state = this.state
					state.saldoNotCompensatedCredit = res.data.data
					this.setState(state)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Erro interno',
					'Erro ao obter saldo dos Bancos.'
				)
			})
	}

	initSaldoNaoCompensadoDebit() {
		getSaldosNaoCompensadoDebit()
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					let state = this.state
					state.saldoNotCompensatedDebit = res.data.data
					this.setState(state)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Erro interno',
					'Erro ao obter saldo dos Bancos.'
				)
			})
	}

	handleChange(event) {
		let state = this.state

		switch (event.target.name) {
			case 'saldoManualModal':
				state.modalContent.saldoManual = event.target.value
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
						onClick={() => {
							this.showModal(data)
						}}
					>
						{formatMoeda(data.saldoManual)}
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

		state.banks.forEach((bank) => {
			saldoLiquido += bank.saldoSistema

			if (bank.bankType === 'Conta Corrente') {
				saldoReal += bank.saldoSistemaDeduzido
			}

			const content = {
				key: bank.id,
				banco: bank.name,
				saldoSistema: formatMoeda(bank.saldoSistemaDeduzido),
				saldoManual: {
					id: bank.id,
					banco: bank.name,
					saldoManual: bank.saldoManual,
				},
				diference: formatMoeda(bank.diference),
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

	showModal = (data) => {
		let state = this.state
		state.modalContent.id = data.id
		state.modalContent.banco = data.banco
		state.modalContent.saldoManual = data.saldoManual
		state.visible = true
		this.setState(state)
	}

	handleOk = (e) => {
		const bankToUpdate = {
			manualBalance: e.saldoManual,
		}

		updateBank(bankToUpdate, e.id)
			.then((res) => {
				if (res.data.code === 201 || res.data.code === 202) {
					openNotification(
						'success',
						'Saldo atualizado',
						'Saldo atualizado com sucesso.'
					)
					this.getListBanks()
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
					'Saldo não cadastrado',
					'Erro interno. Tente novamente mais tarde.'
				)
			})

		this.setState({
			visible: false,
		})
	}

	handleCancel = (e) => {
		this.setState({
			visible: false,
		})
	}

	render() {
		return (
			<>
				<Modal
					title={this.state.modalContent.banco}
					visible={this.state.visible}
					onOk={() => {
						this.handleOk(this.state.modalContent)
					}}
					onCancel={this.handleCancel}
				>
					<Input
						placeholder=''
						type='number'
						name='saldoManualModal'
						size='md'
						value={this.state.modalContent.saldoManual}
						onChange={this.handleChange}
						style={{ width: 100 }}
					/>
				</Modal>
				<Row style={{ paddingBottom: '10px' }}>
					<Col span={12}>
						<Statistic
							title='Previsão de entrada'
							value={formatMoeda(this.state.saldoNotCompensatedCredit)}
						/>
					</Col>
					<Col span={12}>
						<Statistic
							title='Previsão Saída'
							value={formatMoeda(this.state.saldoNotCompensatedDebit)}
						/>
					</Col>
				</Row>
				<Row style={{ paddingBottom: '10px' }}>
					<Col span={12}>
						<Statistic
							title='Saldo Real'
							value={formatMoeda(this.state.saldoReal)}
						/>
					</Col>
					<Col span={12}>
						<Statistic
							title='Saldo Líquido'
							value={formatMoeda(this.state.saldoLiquido)}
						/>
					</Col>
				</Row>
				<Row style={{ paddingBottom: '20px' }}>
					<Col span={12}>
						<Statistic title='Saldo do dia' value='Indisponível' />
					</Col>
				</Row>
				<Title level={4}>Saldo por Banco</Title>
				<Row>
					<Table
						pagination={false}
						columns={this.columns()}
						dataSource={this.state.tableContent}
						size='small'
						expandable={{
							expandedRowRender: (record) => (
								<p style={{ margin: 0 }}>Diferença: {record.diference}</p>
							),
						}}
					/>
				</Row>
			</>
		)
	}
}
export default DashboardDebit
