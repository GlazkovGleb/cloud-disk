import React from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Avatar, Box, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../reducers/userReducer';
import PersonIcon from '@mui/icons-material/Person';
import { baseURL } from '../const/index'

const Navbar = () => {
  // styles
  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '75px',
  }))

  const BtnStyled = styled(Button)(({ theme }) => ({
    margin: '0 0.5rem',
  }))

  // end styles

  const isAuth = useSelector(state => state.user.isAuth)
  const avatar = useSelector(state => state.user.currentUser.avatar)
  const dispatch = useDispatch()

  return (
    <AppBar position="static" color='navbar' >
      <StyledToolbar >
        <Stack direction='row' alignItems='center'>
        <Link to='/profile'>
          {
            avatar
              ?
              <Avatar
                src={`${baseURL}//${avatar}`}
              />
              :
              <Avatar>
                <PersonIcon color='secondary' />
              </Avatar>
          }
          </Link>
          <Typography variant="h5" component="span" fontWeight='bold' pl={2} >
            <Link to='/'>
              Cloud disk
            </Link>
          </Typography>

        </Stack>
        <Box>
          {isAuth
            ?
            <BtnStyled color='btnContained' size='large' variant='contained' onClick={() => dispatch(logoutAction())}>Выйти</BtnStyled>

            :
            <>
              <BtnStyled color='btnContained' size='large' variant='contained'><Link to='login/'>Войти</Link></BtnStyled>
              <BtnStyled color='btnContained' size='large' variant='contained'><Link to='registration/'> Регистрация </Link></BtnStyled>
            </>
          }

        </Box>
      </StyledToolbar>
    </AppBar >
  )
}

export default Navbar