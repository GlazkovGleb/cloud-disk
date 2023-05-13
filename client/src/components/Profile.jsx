import React from 'react'
import { DiskWrap } from '../styles/Disk'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { baseURL } from '../const/index'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import styled from '@emotion/styled'
import { deleteAvatar, uploadAvatar } from '../actions/file'
import useAxios from '../hooks/useAxios'
import { setFeedbackAction } from '../reducers/feedbackReducer'
import sizeFormat from '../utils/sizeFormat'
import ProgressBar from './UI/ProgressBar'

const Profile = () => {
    const user = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()
    const api = useAxios()

    const ImageWrap = styled(Box)(({ theme }) => ({
        position: 'relative',
        '&:hover': {
            '& .avatar': {
                opacity: '20%',
                transition: 'opacity 0.5s'
            },
            '& .avatar__btn': {
                opacity: '1',
                transition: 'opacity 0.5s'
            }
        }
    }))

    const uploadAvatarHandler = e => {
        const file = e.target.files[0]

        const regexp = /^image/
        if (!file.type.match(regexp)) {
            dispatch(setFeedbackAction({ type: 'warning', message: 'Некорректный тип для аватара!' }))
            return
        }

        dispatch(uploadAvatar(api, file))
    }

    const deleteAvatarHandler = () => {
        dispatch(deleteAvatar(api))
    }

    const usedSpacePersent = Math.round(user.usedSpace / user.diskSpace * 100)
    return (
        <Box
            my={4}
        >
            <DiskWrap>
                <Grid container>
                    <Grid item xs={5} md={3}>
                        <ImageWrap>
                            <Box
                                className='avatar__btn'
                                sx={{
                                    position: 'absolute',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: '2',
                                    width: '100%',
                                    gap: '30px',
                                    opacity: '0'
                                }}>
                                <IconButton
                                    size='large'
                                    component="label"
                                >
                                    <input
                                        type='file'
                                        hidden
                                        onChange={uploadAvatarHandler}
                                        accept="image/*"
                                    />
                                    <CreateIcon sx={{ fontSize: '40px' }} color='success' />
                                </IconButton>
                                {
                                    user.avatar &&
                                    <IconButton
                                        size='large'
                                        onClick={deleteAvatarHandler}
                                    >
                                        <DeleteIcon sx={{ fontSize: '40px' }} color='error' />
                                    </IconButton>
                                }
                            </Box>

                            {user.avatar
                                ?
                                <img
                                    src={`${baseURL}//${user.avatar}`}
                                    width={'100%'}
                                    style={{ borderRadius: '30px' }}
                                    className='avatar'
                                />
                                :
                                <AccountBoxIcon
                                    sx={{
                                        fontSize: '300px',
                                        width: '100%'
                                    }}
                                    className='avatar'
                                />
                            }

                        </ImageWrap>
                    </Grid>
                    <Grid item xs={7} md={9}>
                        <Box px={8}>
                            <Typography
                                variant='h5'
                                textAlign={'center'}
                            >Данные о диске пользователя {user.email}</Typography>
                            <Box my={4}>
                                <Typography
                                    variant='h6'
                                    textAlign={'center'}
                                >Занятое место на диске {sizeFormat(user.usedSpace)} из {sizeFormat(user.diskSpace)}</Typography>
                                <ProgressBar
                                    progress={usedSpacePersent}
                                    height={10}
                                    fontVariant='h6'
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DiskWrap>
        </Box>
    )
}

export default Profile