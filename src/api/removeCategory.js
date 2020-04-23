import axios from 'axios'
import proprieties from '../properties'

export default (id) => {
    const response = axios({
        method: 'delete',
        url: proprieties.url+'category/delete/'+id,
    })
    .then((res) => {
        return res
    })
    .catch((err) => {
        return err
    })
    return response 
}
