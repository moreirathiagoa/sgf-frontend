import axios from 'axios'
import properties from '../properties'

const getExtractData = (typeTransaction, filters) => {
	const token = localStorage.getItem('token')
	const response = axios({
		method: 'POST',
		url: properties.url + 'extract-page/get-extract-data/' + typeTransaction,
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
			throw new Error(err.response.data)
		})
	return response
}

export { getExtractData }
