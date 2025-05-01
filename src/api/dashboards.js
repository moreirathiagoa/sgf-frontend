import axios from 'axios'
import properties from '../properties'

const getLatestDashboard = (filter) => {
	const token = localStorage.getItem('token')

	const response = axios({
		method: 'get',
		url: properties.url + `dashboards/list/${filter.year}/${filter.month}`,
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

const updateDashboard = (data) => {
	const token = localStorage.getItem('token')

	return axios({
		method: 'put',
		url: properties.url + 'dashboards/update',
		headers: {
			auth: token,
			'Content-Type': 'application/json',
		},
	})
		.then((res) => res)
		.catch((err) => err.response)
}

export { getLatestDashboard, updateDashboard }
