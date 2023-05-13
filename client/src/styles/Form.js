import styled from "@emotion/styled"
import { Button, Paper, TextField } from "@mui/material"
import theme from "./theme"

export const FormWrap = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.form.main,
    color: theme.palette.form.contrastText,
    width: '50%',
    padding: '30px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: '30px'
}))

export const Input = styled(TextField)(({ theme }) => ({
    width: '75%',
    margin: '15px 0'
}))

export const SubmitBtn = ({ children, ...props }) => {
    return (
        <Button
            variant='text'
            color='btnText'
            sx={{
                marginTop: '20px',
                fontSize: '18px',
            }}
            size='large'
            fontSize='large'
            {...props}
        >{children}</Button>
    )
}