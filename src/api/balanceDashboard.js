import axios from 'axios'
import properties from '../properties'

const getDashboardData = () => {
	const token = localStorage.getItem('token')
	const response = axios({
		method: 'get',
		url: properties.url + 'balancesDashboard/getBalances',
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

export { getDashboardData }
