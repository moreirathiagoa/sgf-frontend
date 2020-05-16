import axios from 'axios'
import properties from '../properties'

const listFatures = (idBank) => {
    const token = localStorage.getItem('token')

    const response = axios({
        method: 'get',
        url: properties.url + 'fature/list/'+idBank,
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
    listFatures,
}