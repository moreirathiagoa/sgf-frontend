import axios from 'axios'
import properties from '../properties'
let token

function getToken(){
    token = localStorage.getItem('token')
}

const listBanks = () => {
    if (!token) getToken()
    
    const response = axios({
        method: 'get',
        url: properties.url+'bank/list',
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

const createBank = (category) => {
    if (!token) getToken()
    
    const response = axios({
        method: 'post',
        url: properties.url+'bank/create',
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

const removeBank = (id) => {
    if (!token) getToken()
    
    const response = axios({
        method: 'delete',
        url: properties.url+'bank/delete/'+id,
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

const updateBank = (category, idCategory) => {
    if (!token) getToken()
    
    const response = axios({
        method: 'put',
        url: properties.url+'bank/update/'+idCategory,
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
    listBanks,
    createBank,
    removeBank,
    updateBank
}