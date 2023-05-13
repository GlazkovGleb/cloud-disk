import { Grid, Typography, Box, keyframes } from '@mui/material'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import File from './File'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Loader from '../UI/Loader'
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ContextMenu from '../UI/ContextMenu'
import useMenu from '../../hooks/useMenu'
import { cutAndPasteFile, pasteFile } from '../../actions/file'
import useAxios from '../../hooks/useAxios'
import { setInfoPopup, showCreateDirPopup, showInfoPopup } from '../../reducers/appReducer'
import { setFeedbackAction } from '../../reducers/feedbackReducer'
import { cleanBuffer } from '../../reducers/fileReducer'



const FilesList = () => {

  const dispatch = useDispatch()
  const files = useSelector(state => state.files.files)
  const loader = useSelector(state => state.app.loader)
  const view = useSelector(state => state.files.view)
  const { data, type } = useSelector(state => state.files.buffer)
  const currentDir = useSelector(state => state.files.currentDir)
  const user = useSelector(state => state.user.currentUser)
  const fileListRef = useRef(null)
  const menu = useMenu(fileListRef, 'outer')
  const api = useAxios()

  const [enter, setEnter] = useState(false)

  const pasteFileHandler = useCallback(() => {
    if (type === 'copy') {
      dispatch(pasteFile(api, data.file, currentDir._id))
      return
    }
    if (type === 'cut') {
      dispatch(cutAndPasteFile(api, data.id, data.parent, currentDir._id))
      dispatch(cleanBuffer())
      return
    }
    dispatch(setFeedbackAction({ type: 'warning', message: 'Буфер обмена пуст' }))
  }, [data, currentDir]) 

  const handleOpenCreateDirPopup = useCallback(() => {
    dispatch(showCreateDirPopup())
  }, []) 

  const handleOpenInfoPopup = useCallback(() => {
    if (!currentDir._id) {
      currentDir.name = 'Главная'
      currentDir.size = user.usedSpace
      currentDir.date = user.date
      currentDir.type = 'dir'
    }
    dispatch(setInfoPopup(currentDir))
    dispatch(showInfoPopup())
  }, [currentDir, user]) 

  const dirMenu = useMemo(() => [
    {
      name: 'Создать папку',
      onClick: handleOpenCreateDirPopup,
      icon: <CreateNewFolderIcon />
    },
    {
      name: 'Вставить',
      onClick: pasteFileHandler,
      icon: <ContentPasteIcon />
    },
    {
      name: 'Сведения',
      onClick: handleOpenInfoPopup,
      icon: <AssignmentIcon />
    }
  ], [handleOpenCreateDirPopup, pasteFileHandler, handleOpenInfoPopup])

  const fileListAnimation = keyframes`
  0% {
       opacity: 0;
       transform: translateY(-50%);
   }
   100% {
       opacity: 1;
       transform: translateY(0);
   }
 `

  const fileModuleAnimation = keyframes`
  0% {
   transform: rotateX(-100deg);
   transform-origin: top;
   opacity: 0;
 }
 100% {
   transform: rotateX(0deg);
   transform-origin: top;
   opacity: 1;
 }
 `

  const fileListStyles = {
    animation: enter && `${fileListAnimation} 500ms forwards`
  }

  const fileModuleStyles = {
    animation: enter && `${fileModuleAnimation} 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) both`
  }

  return (

    <Box
      pt={4}
      pb={16}
      onContextMenu={menu.handleOpenMenu}
    >
      <ContextMenu
        menu={dirMenu}
        open={menu.openMenu}
        position={menu.position}
      />
      {view === 'list' &&
        <Grid container pb={1} sx={{ borderBottom: 'solid 3px' }}>
          <Grid item xs={8}>
            <Typography pl={8} variant='h6'>Название</Typography>
          </Grid>
          <Grid item xs={2} textAlign={'center'}>
            <Typography variant='h6'>Дата</Typography>
          </Grid>
          <Grid item xs={2} textAlign={'center'}>
            <Typography variant='h6'>Размер</Typography>
          </Grid>
        </Grid>
      }

      {files.length === 0 &&
        <Typography variant='h6' textAlign={'center'} mt={6}>Эта папка пуста</Typography>
      }

      {
        loader &&
        <Box my={4}>
          <Loader />
        </Box>
      }

      {view === 'list' &&
        <Box ref={fileListRef}>
          <TransitionGroup >
            {files.map(file =>
              <CSSTransition
                timeout={500}
                exit={false}
                key={file._id}
                in={!loader}
                onEnter={() => setEnter(true)}
                onEntered={() => setEnter(false)}
              >

                <Box sx={fileListStyles}>
                  <File file={file} />
                </Box>
              </CSSTransition>
            )}
          </TransitionGroup>
        </Box>
      }

      {view === 'module' &&
        <Box ref={fileListRef}>
          <TransitionGroup>
            <Grid container spacing={2}>

              {files.map(file =>
                <CSSTransition
                  timeout={500}
                  exit={false}
                  key={file._id}
                  in={!loader}
                  onEnter={() => setEnter(true)}
                  onEntered={() => setEnter(false)}
                >
                  <Grid item lg={2} md={3} xs={6} sm={4} sx={fileModuleStyles}>

                    <File file={file} />
                  </Grid>
                </CSSTransition>
              )
              }
            </Grid>
          </TransitionGroup>
        </Box>
      }
    </Box>
  )

}

export default FilesList