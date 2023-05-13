import { Stack, Typography, Box, Collapse, Alert, Button, IconButton, Snackbar } from '@mui/material'
import React, { useState } from 'react'
import { Btn, FormWrap, Input, SomeBtn, SubmitBtn } from '../../styles/Form'
import { registration } from '../../actions/user'
import { useForm } from 'react-hook-form'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setFeedbackAction } from '../../reducers/feedbackReducer'
import MyAlert from '../UI/MyAlert'


const Registration = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [alertMessage, setAlertMessage] = useState('')

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset
  } = useForm({
    mode: 'onBlur'
  })

  const onSubmit = async (data) => {
    const response = await registration(data.email, data.password)
    if (response.status) {
      dispatch(setFeedbackAction({ type: 'success', message: response.message }))
      navigate('/')
    } else {
      setAlertMessage(response.message)
      reset()
    }
  }

  return (
    <Stack alignItems='center' justifyContent='center' my={5}>
      <FormWrap
        component='form'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography mb={4} variant='h4'>Регистрация</Typography>

        <MyAlert
                    alertMessage={alertMessage}
                    setAlertMessage={setAlertMessage}
                />

        <Input
          color='success'
          label="Введите email"
          variant="outlined"
          {...register('email', {
            required: "Обязательно для заполнения",
            minLength: {
              value: 8,
              message: 'Поле должно содержать не меньше 8 символов'
            },
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
          label="Придумайте пароль"
          variant="outlined"
          {...register('password', {
            required: "Обязательно для заполнения",
            minLength: {
              value: 8,
              message: 'Поле должно содержать не меньше 8 символов'
            }
          })}
          error={errors?.password}
          helperText={errors?.password?.message}
          type='password'
        />
        <Input
          color='success'
          label="Введите повторно пароль"
          variant="outlined"
          {...register('password2', {
            required: "Обязательно для заполнения",
            validate: (value, formValues) => value === formValues.password || 'Пароли не совпадают'
          })}
          error={errors?.password2}
          helperText={errors?.password2?.message}
          type='password'
        />
        <SubmitBtn
          type='submit'
          disabled={!isValid}
        >Зарегистироваться</SubmitBtn>
      </FormWrap>
    </Stack>
  )
}

export default Registration