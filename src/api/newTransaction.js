import axios from 'axios'
import properties from '../properties'

const getTransactionData = (transactionType, transactionId = '') => {
	const token = localStorage.getItem('token')
	const response = axios({
		method: 'get',
		url: `${properties.url}new-transaction/load/${transactionType}/${transactionId}`,
		headers: {
			auth: token,
		},
	})
		.then((res) => {
			return res
		})
		.catch((err) => {
			throw new Error(err?.response?.data || err.message)
		})
	return response
}

export { getTransactionData }
