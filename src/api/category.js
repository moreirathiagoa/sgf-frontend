import axios from 'axios'
import properties from '../properties'
let token

function getToken(){
    token = localStorage.getItem('token')
}

const listCategories = () => {
    if (!token) getToken()
    
    const response = axios({
        method: 'get',
        url: properties.url+'category/list',
        headers:{
            auth: token
        }
    })
    .then((res) => {
        return res
    })
    .catch((err) => {
        return err.response.response
    })
    return response
}

const createCategory = (category) => {
    if (!token) getToken()
    
    const response = axios({
        method: 'post',
        url: properties.url+'category/create',
        data: category,
        headers:{
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
    if (!token) getToken()
    
    const response = axios({
        method: 'delete',
        url: properties.url+'category/delete/'+id,
        headers:{
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
    if (!token) getToken()
    
    const response = axios({
        method: 'put',
        url: properties.url+'category/update/'+idCategory,
        data: category,
        headers:{
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