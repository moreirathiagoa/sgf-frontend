const dotenv = require('dotenv');
dotenv.config();
const url = process.env.url || "http://localhost:4000/"

export default {
        url: url
}
