import axios from 'axios'
import properties from '../properties'

export default (category) => {
    const response = axios({
        method: 'post',
        url: properties.url+'category/create',
        data: category
    })
    .then((res) => {
        return res
    })
    .catch((err) => {
        return err
    })
    return response
}
