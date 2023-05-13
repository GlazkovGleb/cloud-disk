import { createTheme } from '@mui/material/styles';
import { green, grey, red } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: grey[500],
            contrastText: green[800],
        },
        secondary: {
            main: green[600],
        },
        info: {
            main: grey[700],
        },
        darkGrean: {
            main: green[800],
        },
        lightGrean: {
            main: green[600],
        },
        navbar: {
            main: grey[700],
            contrastText: green[500],
        },
        btnContained: {
            main: green[500],
            contrastText: grey[900],
        },
        form: {
            main: grey[100],
            contrastText: green[600],
        },
        input: {
            main: grey[800]
        },
        btnText: {
            main: green[600],
        },
        btnOutlined: {
            main: green[600],
        },
        error: {
            main: red[800]
        }
    },
})

export default theme
