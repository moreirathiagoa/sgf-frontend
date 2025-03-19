import axios from 'axios'
import properties from '../properties'
import { formatDateToMoment } from '../utils'

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

	transaction.effectedAt = formatDateToMoment(transaction.effectedAt)

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

const updateTransaction = (transaction, idTransaction) => {
	const token = localStorage.getItem('token')

	transaction.effectedAt = formatDateToMoment(transaction.effectedAt)

	const params = {
		method: 'put',
		url: properties.url + 'transaction/update/' + idTransaction,
		data: transaction,
		headers: {
			auth: token,
		},
	}

	const response = axios(params)
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
	getTransaction,
	createTransaction,
	bankTransference,
	removeTransaction,
	updateTransaction,
	planToPrincipal,
}
