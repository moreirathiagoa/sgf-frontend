import axios from 'axios'
import properties from '../properties'

const listCategories = () => {
    const token = localStorage.getItem('token')

    const response = axios({
        method: 'get',
        url: properties.url + 'category/list',
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

const createCategory = (category) => {
    const token = localStorage.getItem('token')

    const response = axios({
        method: 'post',
        url: properties.url + 'category/create',
        data: category,
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

const removeCategory = (id) => {
    const token = localStorage.getItem('token')

    const response = axios({
        method: 'delete',
        url: properties.url + 'category/delete/' + id,
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

const updateCategory = (category, idCategory) => {
    const token = localStorage.getItem('token')

    const response = axios({
        method: 'put',
        url: properties.url + 'category/update/' + idCategory,
        data: category,
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
    listCategories,
    createCategory,
    removeCategory,
    updateCategory
}