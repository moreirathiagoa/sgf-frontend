import axios from 'axios'
import properties from '../properties'

const getDashboardData = () => {
	const token = localStorage.getItem('token')
	const response = axios({
		method: 'get',
		url: properties.url + 'balances-dashboard/get-balances',
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

export { getDashboardData }
