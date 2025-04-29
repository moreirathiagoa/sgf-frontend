const env = process.env.REACT_APP_NODE_ENV || 'dev'
let url = ''

switch (env) {
	case 'dev':
		url = `http://${window.location.hostname}:4000/`
		break

	case 'hml':
		url = 'https://l0wsdg6473.execute-api.us-east-1.amazonaws.com/'
		break

	case 'prd':
		url = 'https://ijh3l22gke.execute-api.us-east-1.amazonaws.com/'
		break
	default:
}
console.log('Iniciado em ambiente ' + env.toLocaleUpperCase())

const properties = {
	url: url,
}

export default properties
