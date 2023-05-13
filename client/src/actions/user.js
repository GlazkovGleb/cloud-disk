import axios from 'axios'
import { setUserAction } from '../reducers/userReducer';
import { setFeedbackAction } from '../reducers/feedbackReducer';
import {baseURL} from '../const/index'


export const registration = async (email, password) => {
    try {
        const response = await axios.post(baseURL + '/auth/registration/', {
            email,
            password
        })
        return { status: true, message: response.data.message }
    } catch (e) {
        if (e.response.status === 500) {
            return { status: false, message: 'Упс... Произошла ошибка на сервере!' }
        }
        return { status: false, message: e.response.data.message }
    }
}

export const login = (email, password) => {
    return async dispatch => {
        try {
            const response = await axios.post(baseURL + '/auth/login/', {
                email,
                password
            })
            dispatch(setUserAction(response.data.user))
            dispatch(setFeedbackAction({ type: 'success', message: `Рады Вас снова видеть ${email}` }))
            localStorage.setItem('token', response.data.token)
        } catch (e) {
            if (e.response.status === 500) {
                dispatch(setFeedbackAction({ type: 'error', message: 'Упс... Произошла ошибка на сервере!' }))
            }
            dispatch(setFeedbackAction({ type: 'error', message: e.response.data.message }))
        }
    }
}

export const authByToken = () => {
    return async dispatch => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return
            }
            
            const response = await axios.get(baseURL + '/auth/auth_by_token/',
                { headers: { Authorization: `Bearer ${token}` } })
            dispatch(setUserAction(response.data.user))
            localStorage.setItem('token', response.data.token)
        } catch (e) {
            if (e.response.status === 500) {
                dispatch(setFeedbackAction({ type: 'error', message: 'Упс... Произошла ошибка на сервере!' }))
            }
            localStorage.removeItem('token')
        }
    }
}