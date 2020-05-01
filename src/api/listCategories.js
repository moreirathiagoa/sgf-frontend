import axios from 'axios'
import properties from '../properties'

const listCategories = () => {
    
    const token = localStorage.getItem('token')
    
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
        //console.log(err.response.status);
        
        //res.redirect('admin/login');
        
        return err.response
    })
    return response
}

export default listCategories
