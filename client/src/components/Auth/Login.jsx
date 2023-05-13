import React from 'react'
import { Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Input, SubmitBtn, FormWrap } from '../../styles/Form'
import { useDispatch } from 'react-redux';
import { login } from '../../actions/user'


const Login = () => {
    const dispatch = useDispatch()

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        reset
    } = useForm({
        mode: 'onBlur'
    })

    const onSubmit = (data) => {
        dispatch(login(data.email, data.password))
    }

    return (
        <Stack alignItems='center' justifyContent='center' my={5}>
            <FormWrap
                component='form'
                onSubmit={handleSubmit(onSubmit)}
            >
                <Typography mb={4} variant='h4'>Вход</Typography>

                <Input
                    color='success'
                    label="Введите email"
                    variant="outlined"
                    {...register('email', {
                        required: "Обязательно для заполнения",
                        pattern: {
                            value: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                            message: 'Некорректный email'
                        }
                    })}
                    error={errors?.email}
                    helperText={errors?.email?.message}
                />
                <Input
                    color='success'
                    label="Введите пароль"
                    variant="outlined"
                    {...register('password', {
                        required: "Обязательно для заполнения"
                    })}
                    error={errors?.password}
                    helperText={errors?.password?.message}
                    type='password'
                />

                <SubmitBtn
                    type='submit'
                    disabled={!isValid}
                >Войти</SubmitBtn>
            </FormWrap>
        </Stack>
    )
}

export default Login