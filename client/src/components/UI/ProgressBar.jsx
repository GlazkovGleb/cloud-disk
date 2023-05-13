import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import React from 'react'

const ProgressBar = ({ progress = 0, height = 4, color = 'secondary', fontVariant = 'body1' }) => {
    return (
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Box width={'100%'} mr={1}>
                <LinearProgress
                    value={progress}
                    variant="determinate"
                    color={color}
                    sx={{
                        height: `${height}px`
                    }}
                />
            </Box>
            <Box sx={{ minWidth: 50 }}>
                <Typography
                    variant={fontVariant}
                >{progress} %</Typography>
            </Box>
        </Stack>
    )
}

export default ProgressBar