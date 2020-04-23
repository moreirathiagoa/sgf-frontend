import axios from 'axios'
import properties from '../properties'
console.log(properties.url);


const listCategories = () => {
    const response = axios({
        method: 'get',
        url: properties.url+'category/list',
    })
    .then((res) => {
        return res
    })
    .catch((err) => {
        return err
    })
    return response
}

export default listCategories
