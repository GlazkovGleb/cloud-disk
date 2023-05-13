import React, { useState } from 'react'
import SpringModal from '../UI/Modal'
import { Button, Stack, TextField, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { createDir } from '../../actions/file';
import useAxios from '../../hooks/useAxios';
import { hideCreateDirPopup } from '../../reducers/appReducer';

const CreateDirPopup = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const open = useSelector(state => state.app.createDirPopup)
    const api = useAxios()

    const handleClose = () => {
        dispatch(hideCreateDirPopup())
        setdirName('')
    }
    const [dirName, setdirName] = useState('')
    const dirNameHandler = e => {
        setdirName(e.target.value)
    }
    const createDirHandler = name => {
        dispatch(createDir(api, name, currentDir._id))
        handleClose()
    }

    return (
        <SpringModal
            open={open}
            handleClose={handleClose}
        >
            <Stack direction={'column'} alignItems={'center'}>
                <Typography variant='h5' mb={4}>Создание папки</Typography>
                <TextField
                    color='btnOutlined'
                    label="Название папки"
                    variant="standard"
                    fullWidth
                    sx={{ marginBottom: '30px' }}
                    value={dirName}
                    onChange={dirNameHandler}
                />
                <Button
                    variant='text'
                    color='btnText'
                    disabled={!dirName}
                    onClick={() => createDirHandler(dirName)}
                >
                    Создать
                </Button>
            </Stack>
        </SpringModal>
    )
}

export default CreateDirPopup