import axios from 'axios'
import properties from '../properties'

const getPlaningData = () => {
	const token = localStorage.getItem('token')
	const response = axios({
		method: 'get',
		url: properties.url + 'planing/get-planing-balance',
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

export { getPlaningData }
