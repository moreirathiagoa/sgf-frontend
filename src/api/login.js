import axios from 'axios'
import properties from '../properties'

export default (user) => {
	const response = axios({
		method: 'post',
		url: properties.url + 'login',
		data: user,
	})
		.then((res) => {
			return res
		})
		.catch((err) => {
			console.log('error: ',err)
			return err.response
		})
	return response
}
