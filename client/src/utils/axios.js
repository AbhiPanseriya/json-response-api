import axios from 'axios';
import { isAutheticated } from '../auth/Auth';
const REACT_APP_SERVER = 'https://static-json-api.herokuapp.com/'
export const http =  axios.create({
    baseURL: REACT_APP_SERVER,
});

http.interceptors.request.use((config) => {
    let user = isAutheticated()
    if(user){
        config.headers.Authorization = `Bearer ${isAutheticated().token}`
    }
    return config
}, (err) => {
    return Promise.reject(err)
})
