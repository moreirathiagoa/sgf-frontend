import axios from 'axios'
import PROPRIETIES from '../properties'

export default (id) => {
    const response = axios({
        method: 'delete',
        url: PROPRIETIES.URL+'category/delete/'+id,
    })
    .then((res) => {
        return res
    })
    .catch((err) => {
        return err
    })
    return response 
}
