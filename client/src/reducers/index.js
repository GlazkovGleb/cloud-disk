import {applyMiddleware, combineReducers, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import userReducer from './userReducer'
import fileReducer from './fileReducer'
import feedbackReducer from './feedbackReducer'
import uploadFilesReducer from './uploadFilesReducer'
import appReducer from './appReducer'

const rootReduser = combineReducers({
    user: userReducer,
    files: fileReducer,
    feedback: feedbackReducer,
    uploadedFiles: uploadFilesReducer,
    app: appReducer
})

export const store = createStore(rootReduser, composeWithDevTools(applyMiddleware(thunk)))