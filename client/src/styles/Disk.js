import styled from "@emotion/styled"
import { Button, Container, Paper, TextField } from "@mui/material"
import theme from "./theme"


export const DiskWrap = styled(Container)(({ theme }) => ({
    backgroundColor: theme.palette.form.main,
    color: theme.palette.form.contrastText,
    padding: '30px',
    borderRadius: '10px',
    minHeight: '70vh'
}))



export const Btn = ({ children, ...props }) => {
    return (
        <Button
            {...props}
            variant="outlined"
            color='btnOutlined'
            sx={{
                margin: '0 0.5rem',
            }}
        >
            {children}
        </Button>
    )
}

