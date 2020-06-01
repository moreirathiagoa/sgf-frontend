import axios from 'axios'
import properties from '../properties'

const startServer = () => {
	const response = axios({
		method: 'get',
		url: properties.url,
	})
		.then((res) => {
			return true
		})
		.catch((err) => {
			return false
		})
	return response
}

export { startServer }
