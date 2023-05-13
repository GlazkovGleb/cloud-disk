import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import theme from '../../../styles/theme'
import { Box } from '@mui/material';
import UploadedFile from './UploadedFile';
import { useDispatch, useSelector } from 'react-redux';
import { closeLoaderAction, removeFilesUploadedAction } from '../../../reducers/uploadFilesReducer';
import { addFilesAction } from '../../../reducers/fileReducer';
import { deleteFile } from '../../../actions/file';
import useAxios from '../../../hooks/useAxios';

export default function Uploader() {
    const api = useAxios()
    const dispatch = useDispatch()
    const open = useSelector(state => state.uploadedFiles.isOpenUploader)
    const files = useSelector(state => state.uploadedFiles.files)

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const handleClose = () => {
        files.map(file => {
            dispatch(removeFilesUploadedAction(file.id))
            if (file.progress === 100) {
                dispatch(deleteFile(api, file))
            }
        })
        dispatch(closeLoaderAction())
    }

    const addFilesHandler = () => {
        dispatch(addFilesAction(files))
        dispatch(closeLoaderAction())
    }

    return (
        files.length !== 0 &&
        <Box>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle textAlign={'center'}>
                    Загрузка файлов
                </DialogTitle>
                <DialogContent>
                    {files.map(file =>
                        <UploadedFile
                            file={file}
                            key={file.id}
                        />
                    )}

                </DialogContent>
                <DialogActions>
                    <Button onClick={addFilesHandler} variant='outlined' color='btnOutlined'>
                        Сохранить
                    </Button>
                    <Button onClick={handleClose} variant='outlined' color='error'>
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>      
    );
}
