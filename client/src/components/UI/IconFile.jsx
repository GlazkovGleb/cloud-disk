import React from 'react'
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import DescriptionIcon from '@mui/icons-material/Description';

const IconFile = ({ type, size}) => {
    if (type === 'dir') {
        return (
            <FolderOpenIcon
                sx={{ fontSize: `${size}px` }}
            />
        )
    }

    if (type === 'jpg') {
        return (
            <PermMediaIcon
                sx={{ fontSize: `${size}px` }}
            />
        )
    }

    return (
        <DescriptionIcon
            sx={{ fontSize: `${size}px` }}
        />
    )
}

export default IconFile