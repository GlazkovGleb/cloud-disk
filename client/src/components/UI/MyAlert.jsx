import React from 'react'
import { Box, Collapse, Alert, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const MyAlert = ({ alertMessage, setAlertMessage }) => {
    return (
        <Box sx={{ width: '75%' }} mb={2}>
            <Collapse in={alertMessage}>
                <Alert
                    severity="error"
                    variant="outlined"
                    size='large'
                    sx={{ fontSize: '18px' }}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            onClick={() => {
                                setAlertMessage('');
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {alertMessage}
                </Alert>
            </Collapse>
        </Box>
    )
}

export default MyAlert