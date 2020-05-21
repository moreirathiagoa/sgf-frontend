import { notification } from 'antd';
import moment from 'moment'

function openNotification(type, message, description) {
    notification[type]({
        message: message,
        description: description,
    });
};

function actualDateToUser() {
    const now = moment()

    const dateToUser = now.format("DD/MM/YYYY")
    return dateToUser
}

function actualDateTimeToUser() {
    const now = moment()

    const dateTimeToUser = now.format("DD/MM/YYYY HH:MM")
    return dateTimeToUser
}

function actualDateToBataBase() {
    const now = moment()

    const dateToDataBase = now.format()
    return dateToDataBase
}

function formatDateToMoment(dateInformed) {
    moment.locale('pt-br')
    const dateMoment = moment(dateInformed, "DD/MM/YYYY")

    return dateMoment
}

function formatDateToUser(dateInformed) {
    const dateToMoment = moment(dateInformed)

    const dateToUser = dateToMoment.format("DD/MM/YYYY")
    return dateToUser
}

function formatDateTimeToUser(dateInformed) {
    const dateToMoment = moment(dateInformed)

    const dateTimeToUser = dateToMoment.format("DD/MM/YYYY HH:MM")
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
}