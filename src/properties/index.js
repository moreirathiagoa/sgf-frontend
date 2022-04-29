const env = process.env.REACT_APP_NODE_ENV || 'dev'
let url = ''

switch (env) {
	case 'dev':
		url = 'http://localhost:4000/'
		//url = 'http://192.168.1.6:4000/'

		break
	case 'prd':
		url =
			'https://zcfmqtxww3zrvso2foujel7ka40lyqty.lambda-url.us-east-1.on.aws/'
		break
	default:
}
console.log('Iniciado em ambiente ' + env.toLocaleUpperCase())

const properties = {
	url: url,
}

export default properties
