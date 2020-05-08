const env = process.env.REACT_APP_NODE_ENV || 'dev'
let url = ''

switch (env) {
    case 'dev':
        url = "http://192.168.1.6:4000/"
        break
    case 'prod':
        url = "https://sgf-backend.herokuapp.com/"
        break
    default:
}
console.log('Iniciado em ambiente ' + env.toLocaleUpperCase())

export default {
    url: url,
}
