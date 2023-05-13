import { Box, IconButton } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React from 'react'

const DiskButtons = ({backClickHandler, dirStack, handleCreateDir, uploadFileHandler}) => {
    return (
        <Box>
            <IconButton
                onClick={backClickHandler}
                disabled={!dirStack.length}
                color='secondary'
                size='large'
            >
                <ArrowBackIcon />
            </IconButton>
            <IconButton
                onClick={handleCreateDir}
                color='secondary'
                size='large'
            >
                <CreateNewFolderIcon />
            </IconButton>
            <IconButton
                component="label"
                color='secondary'
                size='large'
            >
                <input
                    type='file'
                    hidden
                    onChange={uploadFileHandler}
                    multiple={true}
                />
                <DownloadIcon />
            </IconButton>
        </Box>
    )
}

export default React.memo(DiskButtons) 