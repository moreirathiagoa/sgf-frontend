import React from 'react'
import { Row, Col, Card } from 'antd'
import '../App.css'
import { listBanksDashboard, futureTransationBalance } from '../api'
import { openNotification, formatMoeda } from '../utils'

class DashboardPlan extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			principalContent: [],
			actualBalance: 0,
		}
		this.handleChange = this.handleChange.bind(this)
	}

	componentDidUpdate() {
		//console.log('update')
	}

	componentDidMount() {
		this.props.mudaTitulo('Dashboard Plano')
		this.initFutureTransationBalance()
		this.getListBanks()
	}

	initFutureTransationBalance() {
		futureTransationBalance()
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					let state = this.state
					state.principalContent = res.data.data
					this.setState(state)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Erro interno',
					'Erro ao obter saldo liquido atual.'
				)
			})
	}

	getListBanks() {
		listBanksDashboard()
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					let state = this.state
					const banks = res.data.data
					let saldoLiquido = 0
					banks.forEach((bank) => {
						saldoLiquido += bank.saldoSistema
					})
					state.actualBalance = saldoLiquido
					this.setState(state)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Erro interno',
					'Erro ao obter a listagem de sados.'
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

	render() {
		let actualBalance = this.state.actualBalance
		return (
			<>
				<p>Saldo Liquido Atual: {formatMoeda(actualBalance)}</p>
				{this.state.principalContent ? (
					this.state.principalContent.map((element) => {
						const liquidBalance =
							element.credit - element.debit * -1 - element.card * -1
						actualBalance = actualBalance + liquidBalance

						const title = (
							<>
								<span>{element.month + '/' + element.year}</span>
								<span style={{ float: 'right' }}>
									{'Acumulado: ' + formatMoeda(actualBalance)}
								</span>
							</>
						)

						return (
							<>
								<Card
									size='small'
									title={title}
									style={{ width: 370, marginBottom: '5px' }}
								>
									<Row>
										<Col span={4}>Entrada:</Col>
										<Col span={7}>{formatMoeda(element.credit)}</Col>
										<Col span={6}>Saída:</Col>
										<Col span={7}>{formatMoeda(element.debit)}</Col>
										<Col span={4}>Cartão:</Col>
										<Col span={7}>{formatMoeda(element.card)}</Col>
										<Col span={6}>Liquido:</Col>
										<Col span={7}>{formatMoeda(liquidBalance)}</Col>
									</Row>
								</Card>
							</>
						)
					})
				) : (
					<Card
						size='small'
						title=''
						style={{ width: 370, marginBottom: '5px' }}
					>
						<p>Não existem planos cadastrados</p>
					</Card>
				)}
			</>
		)
	}
}
export default DashboardPlan