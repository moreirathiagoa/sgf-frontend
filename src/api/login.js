import axios from 'axios'
import properties from '../properties'

const login = (user) => {
	const response = axios({
		method: 'post',
		url: properties.url + 'login',
		data: user,
	})
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err.response
		})
	return response
}

export default login
