import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getFiles, uploadFiles } from '../../actions/file';
import { Box, Stack, Typography } from '@mui/material';
import FilesList from './FilesList';
import { DiskWrap } from '../../styles/Disk';
import CreateDirPopup from './CreateDirPopup';
import { setCurrentDirAction, setView } from '../../reducers/fileReducer';
import CollapsedBreadcrumbs from './Breadcrumbs';
import Uploader from './UploadFiles/Uploader';
import useAxios from '../../hooks/useAxios';
import { debounce } from "lodash";
import { setSearch, showCreateDirPopup } from '../../reducers/appReducer';
import InfoPopup from './InfoPopup';
import Search from './Search';
import Sort from './Sort';
import SelectView from './SelectView';
import DiskButtons from './DiskButtons';

const Disk = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const dirStack = useSelector(state => state.files.dirStack)

    const api = useAxios()

    // Drag and drop
    const [dragEnter, setDragEnter] = useState(false)
    const dragEnterHandler = e => {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(true)
    }
    const dragLeaveHandler = e => {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(false)
    }
    const dropHandler = e => {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(false)
        const files = [...e.dataTransfer.files]
        files.forEach(file => dispatch(uploadFiles(api, file, currentDir._id)))
    }
    // end Drag and drop

    // CreateDirPopup
    const handleCreateDir = useCallback(() => dispatch(showCreateDirPopup()), [])

    // end CreateDirPopup

    const backClickHandler = useCallback(() => {
        const backDir = dirStack.pop()
        dispatch(setCurrentDirAction(backDir))
    }, [dirStack]) 

    // upload files
    const uploadFileHandler = useCallback(e => {
        [...e.target.files].forEach(file => dispatch(uploadFiles(api, file, currentDir._id)))
    }, [currentDir]) 
    // end upload files

    // sort
    const [sort, setSort] = useState('')

    const handleSort = useCallback((event) => {
        setSort(event.target.value)
    }, [])
    // end sort

    // search
    const search = useSelector(state => state.app.search)

    const handleSearch = useCallback((event) => {
        dispatch(setSearch(event.target.value))
        handleSearchDebounce(event.target.value)
    }, [])

    const handleSearchDebounce = useCallback(
        debounce(search => dispatch(getFiles(api, null, sort, search)), 1000),
        []
    )
    // end search

    // views
    const view = useSelector(state => state.files.view)

    const handleChangeView = useCallback((event, nextView) => {
        dispatch(setView(nextView))
    }, [])
    // end views

    useEffect(() => {
        dispatch(getFiles(api, currentDir._id, sort, search))
    }, [currentDir, sort])

    return (

        dragEnter
            ?
            <Box
                my={4}
                mx={6}
                sx={{
                    height: '70vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    border: 'dashed 4px #43a047'
                }}
                onDragEnter={dragEnterHandler}
                onDragLeave={dragLeaveHandler}
                onDragOver={dragEnterHandler}
                onDrop={dropHandler}
                onDragEnd={dragLeaveHandler}
            >
                <Typography
                    color='secondary'
                    variant='h2'
                >
                    Перетащите файлы сюда
                </Typography>
            </Box>
            :
            <Box
                my={4}
                onDragEnter={dragEnterHandler}
                onDragLeave={dragLeaveHandler}
                onDragOver={dragEnterHandler}
                onDragEnd={dragLeaveHandler}
            >
                <CreateDirPopup />
                <InfoPopup />
                <Uploader />
                <DiskWrap>
                    <Box px={4}>
                        <Stack justifyContent='space-between' direction='row' alignItems={'center'}>
                            <DiskButtons
                                backClickHandler={backClickHandler}
                                dirStack={dirStack}
                                handleCreateDir={handleCreateDir}
                                uploadFileHandler={uploadFileHandler}
                            />

                            <Search
                                search={search}
                                handleSearch={handleSearch}
                            />
                            <Box>
                                <Sort
                                    sort={sort}
                                    handleSort={handleSort}
                                />
                                <SelectView
                                    view={view}
                                    handleChangeView={handleChangeView}
                                />
                            </Box>
                        </Stack>
                        <CollapsedBreadcrumbs />
                        <FilesList />
                    </Box>
                </DiskWrap>
            </Box>
    )
}

export default Disk