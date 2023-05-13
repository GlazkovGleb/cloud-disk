import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const Loader = () => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgress size={60} />
        </Box>
    )
}

export default Loader