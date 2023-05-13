import { Box, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import { useDispatch } from 'react-redux';
import { removeFilesUploadedAction } from '../../../reducers/uploadFilesReducer';
import { deleteFile } from '../../../actions/file';
import useAxios from '../../../hooks/useAxios';
import ProgressBar from '../../UI/ProgressBar';

const UploadedFile = ({ file }) => {
    const api = useAxios()
    const dispatch = useDispatch()
    const removeFileHandler = () => {
        dispatch(removeFilesUploadedAction(file.id))
        if (file.progress === 100) {
            dispatch(deleteFile(api, file))
        }
    }

    return (
        <Box sx={{ minWidth: 300 }} mb={1}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} mb={0.5}>
                <Typography>{file.name}</Typography>
                <IconButton
                onClick={removeFileHandler}
                >
                    <CloseIcon />
                </IconButton>
            </Stack>
            <ProgressBar
                progress={file.progress}
            />
        </Box>
    )
}

export default UploadedFile