let env = process.env.REACT_APP_NODE_ENV || 'dev'
let url = ''

switch (env) {
	case 'dev':
		//url = 'http://localhost:4000/'
		url = 'http://192.168.1.6:4000/'
		//url = 'http://192.168.1.4:4000/'
		//url = "http://192.168.43.174:4000/"
		break
	case 'prod':
		//url = 'https://sgf-backend.herokuapp.com/'
		url = 'http://sgfth.us-east-1.elasticbeanstalk.com/'
		break
	default:
}
console.log('Iniciado em ambiente ' + env.toLocaleUpperCase())

export default {
	url: url,
}
