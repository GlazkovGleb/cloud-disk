import Navbar from "./Navbar";
import './app.css'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from "./AppRouter";
import theme from "../styles/theme";
import { ThemeProvider } from '@mui/material/styles';
import Feedback from "./UI/Feedback";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import { authByToken } from "../actions/user";
import { Box, Stack } from "@mui/material";


function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(authByToken())
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Feedback />
        <Navbar />
          <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
