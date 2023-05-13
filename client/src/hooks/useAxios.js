import axios from 'axios'
import { baseURL } from '../const/index'

const useAxios = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        return axios.create({
            baseURL
        })
    }
    return axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${token}` }
    })
}

export default useAxios