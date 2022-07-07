import React from 'react'

import { Row, Col, Card } from 'antd'
import '../App.css'
import { getPlaningData } from '../api'
import { openNotification, prepareValue } from '../utils'
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
		this.props.mudaTitulo('Planejamento')

		return getPlaningData()
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					const planingData = res.data
					this.setState((state) => {
						state.principalContent = planingData.futureTransactionBalance

						let saldoLiquido = 0
						planingData.banksList.forEach((bank) => {
							saldoLiquido += bank.saldoSistema
						})
						state.actualBalance = saldoLiquido

						return state
					})
					this.props.loading(false)
				}
			})
			.catch((err) => {
				openNotification('error', 'Erro ao listar o planejamento', err.message)
			})
	}

	handleChange(event) {
		this.setState((state) => {
			switch (event.target.name) {
				case 'saldoManualModal':
					state.modalContent.saldoManual = event.target.value
					break

				default:
			}
			return state
		})
	}

	render() {
		const inicialBalance = this.state.actualBalance
		let actualBalance = inicialBalance > 0 ? 0 : inicialBalance

		const inicialBalanceFormatted = prepareValue(inicialBalance)

		return (
			<>
				<p>
					Saldo Liquido Atual:{' '}
					<span style={{ color: inicialBalanceFormatted.color }}>
						{inicialBalanceFormatted.value}
					</span>
				</p>

				{this.state.principalContent ? (
					this.state.principalContent.map((element) => {
						const liquidBalance =
							element.credit - element.debit * -1 - element.card * -1
						actualBalance = actualBalance + liquidBalance

						if (
							element.credit + element.debit + element.card + liquidBalance !==
							0
						) {
							const actualBalanceFormatted = prepareValue(actualBalance)
							const creditFormatted = prepareValue(element.credit)
							const debitFormatted = prepareValue(element.debit)
							const cardFormatted = prepareValue(element.card)
							const liquidBalanceFormatted = prepareValue(liquidBalance)

							const title = (
								<>
									<span>{element.month + '/' + element.year}</span>
									<span style={{ float: 'right' }}>
										{'Acumulado: '}
										<span style={{ color: actualBalanceFormatted.color }}>
											{actualBalanceFormatted.value}
										</span>
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
										<Col span={7}>
											<span style={{ color: creditFormatted.color }}>
												{creditFormatted.value}
											</span>
										</Col>
										<Col span={6}>Saída:</Col>
										<Col span={7}>
											<span style={{ color: debitFormatted.color }}>
												{debitFormatted.value}
											</span>
										</Col>
										<Col span={4}>Cartão:</Col>
										<Col span={7}>
											<span style={{ color: cardFormatted.color }}>
												{cardFormatted.value}
											</span>
										</Col>
										<Col span={6}>Liquido:</Col>
										<Col span={7}>
											<span style={{ color: liquidBalanceFormatted.color }}>
												{liquidBalanceFormatted.value}
											</span>
										</Col>
									</Row>
								</Card>
							)
						} else {
							return ''
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
