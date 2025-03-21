import axios from 'axios'
import properties from '../properties'

const listBanks = (transactionType) => {
	const token = localStorage.getItem('token')

	const response = axios({
		method: 'get',
		url: properties.url + 'bank/list/' + transactionType,
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

const createBank = (bank) => {
	const token = localStorage.getItem('token')

	const response = axios({
		method: 'post',
		url: properties.url + 'bank/create',
		data: bank,
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

const removeBank = (id) => {
	const token = localStorage.getItem('token')

	const response = axios({
		method: 'delete',
		url: properties.url + 'bank/delete/' + id,
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

const updateBank = (bank, bankId) => {
	const token = localStorage.getItem('token')

	const response = axios({
		method: 'put',
		url: properties.url + 'bank/update/' + bankId,
		data: bank,
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

export { listBanks, createBank, removeBank, updateBank }
