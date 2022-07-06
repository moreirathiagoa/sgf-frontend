import axios from 'axios'
import properties from '../properties'

const getTransactionData = (transactionType, idTransaction = '') => {
	const token = localStorage.getItem('token')
	const response = axios({
		method: 'get',
		url: `${properties.url}new-transaction/load/${transactionType}/${idTransaction}`,
		headers: {
			auth: token,
		},
	})
		.then((res) => {
			return res
		})
		.catch((err) => {
			throw new Error(err.response.data)
		})
	return response
}

export { getTransactionData }
