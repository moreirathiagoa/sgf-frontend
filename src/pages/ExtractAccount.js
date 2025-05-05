import React from 'react'
import '../App.css'
import { Typography } from 'antd'
import {
	TitleFilter,
	ExtractFilters,
	TransactionCard,
	CreateTransactionButton,
	DeleteTransactionButton,
	SelectAllCheckbox,
} from '../components'
import {
	getExtractData,
	removeTransaction,
	updateTransaction,
	getTransaction,
} from '../api'
import { openNotification, formatDateToUser, prepareValue } from '../utils'
import {
	isChecked,
	deleteTransactionChecked,
	removeTransactionById,
} from '../utils/extractUtils'

const { Title } = Typography
const descriptionsList = new Set()
class ExtractAccount extends React.Component {
	constructor(props) {
		const today = new Date()
		const actualYear = today.getFullYear()
		const actualMonth = today.getMonth() + 1

		super(props)
		this.state = {
			transactions: [],
			allTransactions: [],
			checked: [],

			filters: {
				year: actualYear,
				month: actualMonth,
				onlyCompensated: true,
				onlyNotCompensated: false,
				bankId: null,
				description: '',
				detail: '',
			},

			banks: [],
			descriptions: [],
			idToEdit: null,
			menu: {
				modalVisible: false,
				transactionToUpdate: null,
			},
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleFilter = this.handleFilter.bind(this)
		this.processExtractData = this.processExtractData.bind(this)
		this.handleDeleteTransactionChecked =
			this.handleDeleteTransactionChecked.bind(this)
		this.handleRemoveTransaction = this.handleRemoveTransaction.bind(this)
		this.compensateTransaction = this.compensateTransaction.bind(this)
	}

	componentDidUpdate() {
		if (this.props.update) {
			this.processExtractData()
		}
	}

	componentDidMount() {
		this.props.mudaTitulo('Extrato > Contas Corrente')
		this.processExtractData()
	}

	processExtractData() {
		this.props.loading(true)
		return getExtractData('contaCorrente', this.state.filters)
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					const extractData = res.data

					extractData?.transactionList?.forEach((element) => {
						if (element.description) {
							descriptionsList.add(element.description)
						}
					})

					this.setState((state) => {
						let transactions = extractData.transactionList

						if (state.filters.onlyCompensated) {
							transactions = transactions.filter(
								(transaction) => !transaction.isCompensated
							)
						} else if (state.filters.onlyNotCompensated) {
							transactions = transactions.filter(
								(transaction) => transaction.isCompensated
							)
						}

						state.banks = extractData.banksList
						state.transactions = transactions
						state.allTransactions = extractData.transactionList
						state.descriptions = [...descriptionsList].sort((a, b) =>
							a.localeCompare(b)
						)
						state.checked = state.checked.filter((id) =>
							state.transactions.some((transaction) => transaction._id === id)
						)
						return state
					})
				}
				this.props.loading(false)
			})
			.catch((err) => {
				openNotification('error', 'Erro ao listar os bancos', err.message)
				this.props.loading(false)
			})
	}

	handleFilter(event) {
		this.setState((state) => {
			switch (event.target.name) {
				case 'clearFilter':
					const now = new Date()
					state.transactions = state.allTransactions
					state.filters.year = now.getFullYear()
					state.filters.month = now.getMonth() + 1
					state.filters.bankId = null
					state.filters.description = ''
					state.filters.detail = ''
					state.checked = []
					break

				case 'date':
					state.filters.year = event.target.value.year
					state.filters.month = event.target.value.month
					state.checked = []
					break

				case 'clearDate':
					const nowDate = new Date()
					state.filters.year = nowDate.getFullYear()
					state.filters.month = nowDate.getMonth() + 1
					state.checked = []
					break

				case 'compensationFilter':
					state.filters.onlyCompensated =
						event.target.value === 'notCompensated'
					state.filters.onlyNotCompensated = event.target.value === 'past'
					state.checked = []
					break

				case 'bankId':
					state.filters.bankId = event.target.value
					state.checked = []
					break

				case 'description':
					state.filters.description = event.target.value
					state.checked = []
					break

				case 'detail':
					state.filters.detail = event.target.value
					state.checked = []
					break

				default:
			}
			return state
		}, this.processExtractData)
	}

	handleChange(event) {
		this.setState((state) => {
			switch (event.target.name) {
				case 'checkbox':
					const id = event.target.value
					if (isChecked(id, state.checked)) {
						state.checked = state.checked.filter((element) => element !== id)
					} else {
						state.checked.push(id)
					}
					break

				default:
			}
			return state
		})
	}

	handleDeleteTransactionChecked() {
		deleteTransactionChecked(
			this.state.checked,
			removeTransaction,
			this.processExtractData,
			openNotification,
			this.props.loading
		)
	}

	handleRemoveTransaction(id) {
		removeTransactionById(
			id,
			removeTransaction,
			this.processExtractData,
			openNotification
		)
	}

	compensateTransaction(transactionId) {
		return getTransaction(transactionId)
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					let transaction = res.data.data
					transaction.effectedAt = formatDateToUser(res.data.effectedAt)
					transaction.isCompensated = true
					return transaction
				}
			})
			.then((transaction) => {
				return updateTransaction(transaction, transaction._id)
			})
			.then((res) => {
				if (res.data.code === 201 || res.data.code === 202) {
					openNotification(
						'success',
						'Transação atualizada',
						'Transação atualizada com sucesso.'
					)
					this.processExtractData()
				} else {
					openNotification(
						'error',
						'Transação não atualizada',
						`A Transação não pode ser atualizada: ${res?.data?.message}`
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

	render() {
		return (
			<div>
				<div>
					<TitleFilter handleChange={this.handleFilter} />
					<ExtractFilters
						handleChange={this.handleFilter}
						year={this.state.filters.year}
						month={this.state.filters.month}
						bankId={this.state.filters.bankId}
						banks={this.state.banks}
						descriptions={this.state.descriptions}
						description={this.state.filters.description}
						detail={this.state.filters.detail}
						showCompensationFilter={true}
						compensationFilterValue={
							this.state.filters.onlyCompensated
								? 'notCompensated'
								: this.state.filters.onlyNotCompensated
								? 'past'
								: 'all'
						}
						onCompensationFilterChange={(e) =>
							this.handleFilter({
								target: {
									name: 'compensationFilter',
									value: e.target.value,
								},
							})
						}
					/>
					<div>
						<Title level={4}>
							Transações
							<CreateTransactionButton
								onClick={() => {
									this.props.showModal({ transactionType: 'contaCorrente' })
								}}
								tooltip='Adicionar nova transação'
							/>
							<DeleteTransactionButton
								onConfirm={this.handleDeleteTransactionChecked}
								disabled={this.state.checked.length === 0}
							/>
							<SelectAllCheckbox
								transactions={this.state.transactions}
								checkedIds={this.state.checked}
								onSelectionChange={(checkedIds) =>
									this.setState({ checked: checkedIds })
								}
							/>
						</Title>
					</div>

					{this.state.transactions.map((element) => {
						const transactionValue = prepareValue(
							element.value,
							element.isCompensated
						)

						return (
							<TransactionCard
								transaction={element}
								transactionValue={transactionValue}
								isChecked={(id) => isChecked(id, this.state.checked)}
								handleChange={this.handleChange}
								handleRemoveTransaction={this.handleRemoveTransaction}
								handleEditTransaction={(id) =>
									this.props.showModal({
										transactionType: 'contaCorrente',
										transactionId: id,
									})
								}
								handleCompensateTransaction={(id) =>
									this.compensateTransaction(id)
								}
							/>
						)
					})}
				</div>
			</div>
		)
	}
}
export default ExtractAccount
