import React, { useState } from 'react'
import SpringModal from '../UI/Modal'
import { useDispatch, useSelector } from 'react-redux'
import useAxios from '../../hooks/useAxios'
import { hideInfoPopup, setNameInfoPopup } from '../../reducers/appReducer'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import sizeFormat from '../../utils/sizeFormat'
import { renameFile } from '../../actions/file'

const InfoPopup = () => {
    const dispatch = useDispatch()
    const open = useSelector(state => state.app.infoPopup.isOpen)
    const file = useSelector(state => state.app.infoPopup.file)

    const api = useAxios()

    const handleClose = () => {
        dispatch(hideInfoPopup())
    }

    const handleChangeName = e => {
        dispatch(setNameInfoPopup(e.target.value))
    }

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            name: '',
        }
    })

    const onSubmit = (data) => {
        dispatch(renameFile(api, file._id, data.name))
    }


    return (
        <SpringModal
            open={open}
            handleClose={handleClose}
        >
            <Box
                px={4}
                component={'form'}
                onSubmit={handleSubmit(onSubmit)}
            >
                <Stack
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    direction={'row'}
                    mb={2}

                >
                    <Typography>Имя</Typography>
                    <TextField
                        value={file?.name}
                        variant='standard'
                        color='primary'
                        sx={{
                            width: '60%'
                        }}
                        {...register('name', {
                            required: "Имя не может быть пустым",
                            pattern: file?.type === 'dir' ? {} : {
                                value: /^([A-Za-zа-я0-9_\-\.])+\.([a-z])/,
                                message: 'Файл должен иметь расширение'
                            },
                            onChange: handleChangeName
                        })}
                        error={errors?.name}
                        helperText={errors?.name?.message}
                    />
                </Stack>
                <Stack
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    direction={'row'}
                    mb={2}
                >
                    <Typography>Размер</Typography>
                    <Typography>{sizeFormat(file?.size)}</Typography>
                </Stack>
                <Stack
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    direction={'row'}
                    mb={4}
                >
                    <Typography>Дата</Typography>
                    <Typography>{file?.date?.slice(0, 10)}</Typography>
                </Stack>
                <Button
                    variant='text'
                    color='btnText'
                    sx={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'block'
                    }}
                    type='submit'
                    disabled={!isValid}
                >
                    Подвердить изменения
                </Button>
            </Box>
        </SpringModal>
    )
}

export default InfoPopup