import { Box, Grid, IconButton, Stack, Typography } from '@mui/material'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled';
import IconFile from '../UI/IconFile';
import { useDispatch, useSelector } from 'react-redux';
import { hideMenu, pushToStackAction, setBuffer, setCurrentDirAction, showMenu } from '../../reducers/fileReducer';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ShareIcon from '@mui/icons-material/Share';
import { deleteFile, downloadfile } from '../../actions/file';
import useAxios from '../../hooks/useAxios';
import sizeFormat from '../../utils/sizeFormat';
import { cleanSearch, setInfoPopup, showInfoPopup } from '../../reducers/appReducer';
import { updateStackAction } from '../../reducers/fileReducer';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContextMenu from '../UI/ContextMenu';
import useMenu from '../../hooks/useMenu';

const File = ({ file }) => {

  const buffer = useSelector(state => state.files.buffer)

  const ListItem = styled(Grid)(({ theme }) => ({
    borderBottom: 'solid 3px',
    '&:hover': menu.openMenu ? {} : {
      borderBottomColor: '#2e7d32',
      color: '#2e7d32',
      scale: '1.02',
      '& #date': {
        display: 'none',
      },
      '& #size': {
        display: 'none',
      },
      '& #optionBtn': {
        display: 'block',
      },
    },
    transitionDuration: '0.5s',
    cursor: 'pointer',
    opacity: (buffer.type === 'cut' && buffer.data.id === file._id) && 0.5
  }))

  const ModuleItem = styled(Box)(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': menu.openMenu ? {} : {
      color: '#2e7d32',
      scale: '1.1'
    },
    transitionDuration: '0.5s',
    opacity: (buffer.type === 'cut' && buffer.data.id === file._id) && 0.5
  }))

  const dispatch = useDispatch()
  const currentDir = useSelector(state => state.files.currentDir)
  const search = useSelector(state => state.app.search)
  const view = useSelector(state => state.files.view)
  const api = useAxios()

  // file actions
  const openDirHandler = useCallback(() => {
    if (file.type !== 'dir') {
      return
    }
    if (search) {
      dispatch(cleanSearch())
      dispatch(setCurrentDirAction(file))
      dispatch(updateStackAction([{
        _id: null,
        name: 'Главная'
      }]))
      return
    }
    dispatch(pushToStackAction(currentDir._id, currentDir.name))
    dispatch(setCurrentDirAction(file))
  }, [file, search, currentDir]) 

  const downloadFileHandler = useCallback(() => {
    dispatch(downloadfile(file))
  }, [file]) 

  const deleteFileHandler = useCallback(() => {
    dispatch(deleteFile(api, file))
  }, [file]) 

  const copyFileHandler = useCallback(() => {
    dispatch(setBuffer('copy', {
      file: file._id
    }))
  }, [file]) 

  const cutFileHandler = useCallback(() => {
    dispatch(setBuffer('cut', {
      id: file._id,
      parent: file.parent,
      name: file.name
    }))
  }, [file]) 

  const handleOpenInfoPopup = useCallback(() => {
    dispatch(setInfoPopup(file))
    dispatch(showInfoPopup())
  }, [file]) 
  // end file actions

  // Menu
  const fileItemRef = useRef(null)
  const menu = useMenu(fileItemRef, 'inner')

  const fileMenu = useMemo(() => [
    {
      name: 'Загрузить',
      onClick: downloadFileHandler,
      icon: <ArrowCircleDownIcon />
    },
    {
      name: 'Копировать',
      onClick: copyFileHandler,
      icon: <ContentCopy />
    },
    {
      name: 'Вырезать',
      onClick: cutFileHandler,
      icon: <ContentCut />
    },
    {
      name: 'Удалить',
      onClick: deleteFileHandler,
      icon: <DeleteIcon />
    },
    {
      name: 'Сведения',
      onClick: handleOpenInfoPopup,
      icon: <AssignmentIcon />
    }
  ], [downloadFileHandler, copyFileHandler, cutFileHandler, deleteFileHandler, handleOpenInfoPopup])

  const dirMenu = useMemo(() => [
    {
      name: 'Удалить',
      onClick: deleteFileHandler,
      icon: <DeleteIcon />
    },
    {
      name: 'Сведения',
      onClick: handleOpenInfoPopup,
      icon: <AssignmentIcon />
    }
  ], [deleteFileHandler, handleOpenInfoPopup])

  // end Menu

  switch (view) {
    case 'module':
      return (
        <ModuleItem>
          <ContextMenu
            menu={file.type === 'dir' ? dirMenu : fileMenu}
            open={menu.openMenu}
            position={menu.position}
          />
          <Box
            onClick={openDirHandler}
            onContextMenu={menu.handleOpenMenu}
            ref={fileItemRef}
          >
            <IconFile type={file.type} size={100} />
          </Box>
          <Typography variant='body2' component='p' textAlign={'center'} px={2}>{file.name}</Typography>
        </ModuleItem>
      )
    case 'list':
      return (
        <>
          <ListItem
            my={2}
            pb={1}
            container
          >
            <ContextMenu
              menu={file.type === 'dir' ? dirMenu : fileMenu}
              open={menu.openMenu}
              position={menu.position}
            />
            <Grid
              item
              xs={8}
              onClick={openDirHandler}
              onContextMenu={menu.handleOpenMenu}
              ref={fileItemRef}
            >

              <Stack direction={'row'}>
                <IconFile type={file.type} size={40} />
                <Typography pl={4} variant='h6' component='p'>{file.name}</Typography>
              </Stack>
            </Grid>
            <Grid id='date' item xs={2} textAlign={'center'}>
              <Typography variant='h6'>{file.date.slice(0, 10)}</Typography>
            </Grid>
            <Grid id='size' item xs={2} textAlign={'center'}>
              <Typography variant='h6'>{sizeFormat(file.size)}</Typography>
            </Grid>
            <Grid hidden id="optionBtn" item xs={4} textAlign={'center'}>
              {file.type !== 'dir' &&
                <>
                  <IconButton
                    size="large"
                    onClick={downloadFileHandler}
                  >
                    <ArrowCircleDownIcon fontSize="inherit" color='success' />
                  </IconButton>

                  <IconButton
                    size="large"
                    onClick={copyFileHandler}
                  >
                    <ContentCopy fontSize="inherit" color='info' />
                  </IconButton>
                  <IconButton
                    size="large"
                    onClick={cutFileHandler}
                  >
                    <ContentCut fontSize="inherit" color='info' />
                  </IconButton>
                </>
              }
              <IconButton
                size="large"
                onClick={deleteFileHandler}
              >
                <DeleteIcon fontSize="inherit" color='error' />
              </IconButton>
              <IconButton
                size="large"
                onClick={handleOpenInfoPopup}
              >
                <AssignmentIcon fontSize="inherit" color='info' />
              </IconButton>
            </Grid>
          </ListItem>
        </>
      )
  }

}

export default memo(File) 