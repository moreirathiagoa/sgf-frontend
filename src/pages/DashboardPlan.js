import React from 'react'

import { Row, Col, Card } from 'antd'
import '../App.css'
import { listBanksDashboard, futureTransactionBalance } from '../api'
import { openNotification, formatMoeda } from '../utils'
import { uniqueId } from 'lodash'

class DashboardPlan extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			principalContent: [],
			actualBalance: 0,
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
		this.props.mudaTitulo('Dashboard Plano')

		Promise.all([
			this.initFutureTransactionBalance(),
			this.getListBanks(),
		]).then(() => this.props.loading(false))
	}

	initFutureTransactionBalance() {
		return futureTransactionBalance()
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
		return listBanksDashboard()
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

						if (
							element.credit + element.debit + element.card + liquidBalance !==
							0
						) {
							const title = (
								<>
									<span>{element.month + '/' + element.year}</span>
									<span style={{ float: 'right' }}>
										{'Acumulado: ' + formatMoeda(actualBalance)}
									</span>
								</>
							)

							return (
								<Card
									size='small'
									title={title}
									style={{ width: 370, marginBottom: '5px' }}
									key={uniqueId()}
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
							)
						}
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
