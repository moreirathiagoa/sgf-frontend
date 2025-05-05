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
	SendToAccount,
} from '../components'
import { getExtractData, removeTransaction, planToPrincipal } from '../api'
import { openNotification, prepareValue } from '../utils'
import {
	isChecked,
	deleteTransactionChecked,
	removeTransactionById,
} from '../utils/extractUtils'

const { Title } = Typography
const descriptionsList = new Set()
const now = new Date()
const nextMonthDate = new Date(now.setMonth(new Date().getMonth() + 1))
const nextMonthYear = nextMonthDate.getFullYear()
const nextMonthMonth = nextMonthDate.getMonth() + 1

class ExtractPlan extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			transactions: [],
			allTransactions: [],
			checked: [],
			year: nextMonthYear,
			month: nextMonthMonth,
			notCompensated: false,
			bankId: null,
			description: '',
			detail: '',
			banks: [],
			descriptions: [],
			idToEdit: null,
			menu: {
				modalVisible: false,
				transactionToUpdate: null,
			},
		}
		this.handleFilter = this.handleFilter.bind(this)
		this.toAccount = this.toAccount.bind(this)
		this.handleDeleteTransactionChecked =
			this.handleDeleteTransactionChecked.bind(this)
		this.handleRemoveTransaction = this.handleRemoveTransaction.bind(this)
		this.processExtractData = this.processExtractData.bind(this)
	}

	componentDidUpdate() {
		if (this.props.update) {
			this.processExtractData()
		}
	}

	componentDidMount() {
		this.props.mudaTitulo('Extrato > Planejamentos Futuros')
		this.processExtractData()
	}

	processExtractData() {
		this.props.loading(true)
		return getExtractData('planejamento')
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
						state.banks = extractData.banksList
						state.transactions = extractData.transactionList
						state.allTransactions = extractData.transactionList
						state.descriptions = [...descriptionsList].sort((a, b) =>
							a.localeCompare(b)
						)
						return state
					})
				}
				this.filterList()
				this.props.loading(false)
			})
			.catch((err) => {
				openNotification('error', 'Erro ao listar os bancos', err.message)
			})
	}

	handleFilter(event) {
		this.setState((state) => {
			switch (event.target.name) {
				case 'clearFilter':
					state.transactions = state.allTransactions
					state.year = null
					state.month = null
					state.bankId = null
					state.description = ''
					state.detail = ''
					state.checked = []
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

				case 'bankId':
					state.bankId = event.target.value
					state.checked = []
					break

				case 'description':
					state.description = event.target.value
					state.checked = []
					break

				case 'descriptionList':
					if (event?.target?.value?.length > 0) {
						state.descriptions = event.target.value
						this.processExtractData()
					}
					break

				case 'detail':
					state.detail = event.target.value
					state.checked = []
					break

				case 'checkbox':
					const id = event.target.value
					if (isChecked(id, state.checked)) {
						state.checked = state.checked.filter((element) => element !== id)
					} else {
						state.checked.push(id)
					}
					break

				case 'date':
					state.year = event.target.value.year
					state.month = event.target.value.month
					state.checked = []
					break

				case 'clearDate':
					const now = new Date()
					state.year = now.getFullYear()
					state.month = now.getMonth() + 1
					state.checked = []
					break

				default:
			}
			return state
		}, this.filterList)
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

	filterList() {
		this.setState((state) => {
			const transactionFiltered = state.allTransactions.filter(
				(transaction) => {
					let toReturn = true

					if (this.state.bankId !== null) {
						if (
							transaction.bankId._id.toString() !== this.state.bankId.toString()
						) {
							toReturn = false
						}
					}

					if (this.state.description !== '') {
						const description = transaction?.description?.toLowerCase()
						const filterDescription = this?.state?.description?.toLowerCase()
						if (!description?.includes(filterDescription)) {
							toReturn = false
						}
					}

					if (this.state.detail !== '') {
						const detail = transaction?.detail?.toLowerCase()
						const filterDetail = this?.state?.detail?.toLowerCase()
						if (!detail?.includes(filterDetail)) {
							toReturn = false
						}
					}

					if (this.state.year !== null) {
						let now = new Date(transaction.effectedAt)
						const ano = now.getFullYear()

						if (ano !== parseInt(this.state.year, 10)) {
							toReturn = false
						}
					}

					if (this.state.month !== null) {
						let now = new Date(transaction.effectedAt)
						const mes = now.getMonth() + 1

						if (mes !== parseInt(this.state.month, 10)) {
							toReturn = false
						}
					}

					if (toReturn) {
						return transaction
					}
					return null
				}
			)

			state.transactions = transactionFiltered
			state.checked = state.checked.filter((id) =>
				transactionFiltered.some((transaction) => transaction._id === id)
			)
			return state
		})
	}

	toAccount() {
		this.props.loading(true)
		const transactionsToAccount = this.state.transactions.filter(
			(transaction) => this.state.checked.includes(transaction._id)
		)
		planToPrincipal(transactionsToAccount)
			.then((res) => {
				if (res.data.code === 201 || res.data.code === 202) {
					openNotification(
						'success',
						'Transações atualizadas',
						'Transações atualizadas com sucesso.'
					)
					this.processExtractData()
				} else {
					openNotification(
						'error',
						'Transações não atualizadas',
						res.data.message
					)
				}
				this.props.loading(false)
			})
			.catch((err) => {
				openNotification(
					'error',
					'Transações não atualizadas',
					'Erro interno. Tente novamente mais tarde.'
				)
				this.props.loading(false)
			})
	}

	render() {
		return (
			<div>
				<div>
					<TitleFilter handleChange={this.handleFilter} />
					<ExtractFilters
						handleChange={this.handleFilter}
						year={this.state.year}
						month={this.state.month}
						bankId={this.state.bankId}
						banks={this.state.banks}
						descriptions={this.state.descriptions}
						description={this.state.description}
						detail={this.state.detail}
						showCompensationFilter={false} // Não exibir o Radio.Group
					/>
					<div>
						<Title level={4}>
							Transações
							<CreateTransactionButton
								onClick={() => {
									this.props.showModal({ transactionType: 'planejamento' })
								}}
								tooltip='Adicionar nova transação'
							/>
							<SendToAccount
								onConfirm={this.toAccount}
								disabled={this.state.checked.length === 0}
							/>
							<DeleteTransactionButton
								onConfirm={this.handleDeleteTransactionChecked} // Passar a função diretamente
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
								handleChange={this.handleFilter}
								handleRemoveTransaction={this.handleRemoveTransaction}
								handleEditTransaction={(id) =>
									this.props.showModal({
										transactionType: 'planejamento',
										transactionId: id,
									})
								}
							/>
						)
					})}
				</div>
			</div>
		)
	}
}
export default ExtractPlan
