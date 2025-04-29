import { notification } from 'antd'
import moment from 'moment'

function openNotification(type, message, description) {
	notification[type]({
		message: message,
		description: description,
		onClick: () => {
			notification.destroy();
		},
	})
}

function actualDateToUser() {
	const now = moment()

	const dateToUser = now.format('DD/MM/YYYY')
	return dateToUser
}

function actualDateTimeToUser() {
	const now = moment()

	const dateTimeToUser = now.format('DD/MM/YYYY HH:MM')
	return dateTimeToUser
}

function actualDateToBataBase() {
	const now = moment()

	const dateToDataBase = now.format()
	return dateToDataBase
}

function formatDateToMoment(dateInformed) {
	moment.locale('pt-br')
	const dateMoment = moment(dateInformed, 'DD/MM/YYYY')

	return dateMoment
}

function formatDateToUser(dateInformed) {
	const dateToMoment = moment(dateInformed)

	const dateToUser = dateToMoment.format('DD/MM/YYYY')
	return dateToUser
}

function formatDateTimeToUser(dateInformed) {
	const dateToMoment = moment(dateInformed)

	const dateTimeToUser = dateToMoment.format('DD/MM/YYYY HH:MM')
	return dateTimeToUser
}

function formatDateToBataBase(dateInformed) {
	const dateToMoment = moment(dateInformed)

	const dateToDataBase = dateToMoment.format()
	return dateToDataBase
}

function formatMoeda(entrada) {
	return entrada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function prepareValue(value, isCompensated) {
	if (isCompensated === undefined) isCompensated = true

	let color = 'green'

	if (value < 0) {
		color = 'red'
		value = -1 * value
	}
	value = formatMoeda(value)
	if (!isCompensated) {
		value = `[ ${value} ]`
	}

	return {
		value: value,
		color: color,
	}
}

// TODO: Verificar remoção de caracteres não funcionando
const formatNumber = (value, separator) => {
	if (!value) return ''
	return value
		.toString()
		.replace(/(?!^-)\D/g, '') //Remover qualquer caractere não numérico
		.replace(/^0+(\d)/, '$1') //Remove zeros à esquerda
		.padStart(3, '0') //Mínimo de três dígitos (para 2 casas decimais)
		.replace(/(\d+)(\d{2})$/, `$1${separator}$2`) //Casas decimais separadas dinamicamente (vírgula ou ponto)
}

export {
	openNotification,
	actualDateToUser,
	actualDateTimeToUser,
	actualDateToBataBase,
	formatDateToUser,
	formatDateTimeToUser,
	formatDateToBataBase,
	formatDateToMoment,
	formatMoeda,
	prepareValue,
	formatNumber,
}
