import axios from 'axios'
import properties from '../properties'
import { formatDateToMoment } from '../utils'

const listTransaction = (typeTransaction, filters) => {
	const token = localStorage.getItem('token')

	const response = axios({
		method: 'POST',
		url: properties.url + 'transaction/list/' + typeTransaction,
		headers: {
			auth: token,
		},
		data: {
			filters: filters,
		},
	})
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err.response
		})
	return response
}

const getTransaction = (idTransaction) => {
	const token = localStorage.getItem('token')

	const response = axios({
		method: 'get',
		url: properties.url + 'transaction/' + idTransaction,
		headers: {
			auth: token,
		},
	})
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err.response
		})
	return response
}

const createTransaction = (transaction) => {
	const token = localStorage.getItem('token')

	transaction.efectedDate = formatDateToMoment(transaction.efectedDate)

	const response = axios({
		method: 'post',
		url: properties.url + 'transaction/create',
		data: transaction,
		headers: {
			auth: token,
		},
	})
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err.response
		})
	return response
}

const bankTransference = (data) => {
	const token = localStorage.getItem('token')

	const response = axios({
		method: 'post',
		url: properties.url + 'transaction/bank-transfer',
		data: data,
		headers: {
			auth: token,
		},
	})
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err.response
		})
	return response
}

const removeTransaction = (id) => {
	const token = localStorage.getItem('token')

	const response = axios({
		method: 'delete',
		url: properties.url + 'transaction/delete/' + id,
		headers: {
			auth: token,
		},
	})
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err.response
		})
	return response
}

const updateTransaction = (transaction, idCategory) => {
	const token = localStorage.getItem('token')

	transaction.efectedDate = formatDateToMoment(transaction.efectedDate)

	const response = axios({
		method: 'put',
		url: properties.url + 'transaction/update/' + idCategory,
		data: transaction,
		headers: {
			auth: token,
		},
	})
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err.response
		})
	return response
}

const getSaldosNaoCompensado = () => {
	const token = localStorage.getItem('token')
	const response = axios({
		method: 'get',
		url: properties.url + 'transaction/not-compensated-by-bank',
		headers: {
			auth: token,
		},
	})
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err.response
		})
	return response
}

const futureTransactionBalance = () => {
	const token = localStorage.getItem('token')
	const response = axios({
		method: 'get',
		url: properties.url + 'transaction/future-balance',
		headers: {
			auth: token,
		},
	})
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err.response
		})
	return response
}

const planToPrincipal = (transaction) => {
	const token = localStorage.getItem('token')

	const response = axios({
		method: 'post',
		url: properties.url + 'transaction/planToPrincipal',
		data: transaction,
		headers: {
			auth: token,
		},
	})
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err.response
		})
	return response
}

export {
	listTransaction,
	getTransaction,
	createTransaction,
	bankTransference,
	removeTransaction,
	updateTransaction,
	getSaldosNaoCompensado,
	planToPrincipal,
	futureTransactionBalance,
}
