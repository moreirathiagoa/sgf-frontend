import axios from 'axios'
import properties from '../properties'

const listCategories = () => {
    
    const token = localStorage.getItem('token')
    
    const response = axios({
        method: 'get',
        url: properties.url+'category/list',
        headers:{
            //auth: token
            auth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRoaWFnbyIsImRhdGFfZ2VyYWNhbyI6IjIwMjAtMDUtMDFUMDQ6NTE6MjguMTg0WiIsImlhdCI6MTU4ODMwODY4OCwiZXhwIjoxNTg4MzEyMjg4fQ.k_-l0cmYwWjSIkdq-dRdLLJgzUHOSq7TWuvX4Vyqefs"
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
