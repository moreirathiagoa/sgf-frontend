import axios from 'axios'
import properties from '../properties'

const listTransaction = () => {
    const token = localStorage.getItem('token')

    const response = axios({
        method: 'get',
        url: properties.url + 'transaction/list',
        headers: {
            auth: token
        }
    })
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err.response
        })
    return response
}

const createTransaction = (transaction) => {
    const token = localStorage.getItem('token')

    const response = axios({
        method: 'post',
        url: properties.url + 'transaction/create',
        data: transaction,
        headers: {
            auth: token
        }
    })
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err.response
        })
    return response
}

const removeTransaction = (id) => {
    const token = localStorage.getItem('token')

    const response = axios({
        method: 'delete',
        url: properties.url + 'transaction/delete/' + id,
        headers: {
            auth: token
        }
    })
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err.response
        })
    return response
}

const updateTransaction = (transaction, idCategory) => {
    const token = localStorage.getItem('token')

    const response = axios({
        method: 'put',
        url: properties.url + 'transaction/update/' + idCategory,
        data: transaction,
        headers: {
            auth: token
        }
    })
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err.response
        })
    return response
}

export {
    listTransaction,
    createTransaction,
    removeTransaction,
    updateTransaction
}