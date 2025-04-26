import axios from 'axios'
import properties from '../properties'

const getLatestDashboard = () => {
	const token = localStorage.getItem('token')

	const response = axios({
		method: 'get',
		url: properties.url + 'dashboards/list',
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

export { getLatestDashboard }
