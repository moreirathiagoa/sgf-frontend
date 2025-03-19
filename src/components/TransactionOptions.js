import React from 'react'

import 'antd/dist/antd.min.css'
import { Menu } from 'antd'

import { updateTransaction, getTransaction } from '../api'
import { openNotification, formatDateToUser } from '../utils'

class TransactionOptions extends React.Component {
	compensateTransaction(idTransaction) {
		if (window.confirm('Deseja realmente compensar essa Transação?')) {
			return getTransaction(idTransaction)
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
				.then((res) => {
					return updateTransaction(res, res._id)
				})
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
						'Transação não atualizada',
						'Erro interno. Tente novamente mais tarde.'
					)
					return 'error'
				})
		} else {
			const promise = new Promise((resolve, reject) => {
				resolve()
			})

			return promise
		}
	}

	render() {
		return (
			<Menu>
				<Menu.Item
					onClick={() => {
						this.props.showModal({
							transactionType: this.props.screenType,
							idTransaction: this.props.element._id,
						})

						this.props.closeModal()
					}}
				>
					Editar
				</Menu.Item>
				{this.props.screenType === 'contaCorrente' ? (
					<Menu.Item
						onClick={() => {
							this.compensateTransaction(this.props.element._id).then(() => {
								this.props.list()
							})
							this.props.closeModal()
						}}
					>
						Compensar
					</Menu.Item>
				) : (
					''
				)}

				<Menu.Item
					onClick={() => {
						this.props.remover(this.props.element._id).then(() => {
							this.props.list()
						})

						this.props.closeModal()
					}}
				>
					Apagar
				</Menu.Item>
			</Menu>
		)
	}
}
export default TransactionOptions
