import { Alert, Snackbar } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setFeedbackAction } from '../../reducers/feedbackReducer';

const Feedback = () => {
    const feedback = useSelector(state => state.feedback)
    const dispatch = useDispatch()
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={Boolean(feedback.message)}
            onClose={() => dispatch(setFeedbackAction({type: '', message: ''}))}
        >
            <Alert 
            severity={feedback?.type || 'info'}
            sx={{fontSize: '20px', maxWidth: '75vw'}}
            >{feedback?.message}</Alert>
        </Snackbar>
    )
}

export default Feedback