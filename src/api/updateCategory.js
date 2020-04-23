import axios from 'axios'
import properties from '../properties'

export default (category, idCategory) => {
    const response = axios({
        method: 'put',
        url: properties.url+'category/update/'+idCategory,
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
