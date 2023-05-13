const defaultState = {
    isOpenUploader: false,
    files: []
}

const SHOW_UPLOADER = 'SHOW_UPLOADER'
const CLOSE_UPLOADER = 'CLOSE_UPLOADER'
const ADD_UPLOADED_FILE = 'ADD_UPLOADED_FILE'
const REMOVE_UPLOADED_FILE = 'REMOVE_UPLOADED_FILE'
const CHANGE_UPLOAD_PROGESS = 'CHANGE_UPLOAD_PROGESS'
const ADD_DATA_TO_FILE = 'ADD_DATA_TO_FILE'


export default function uploadFilesReducer(state = defaultState, action) {
    switch (action.type) {
        case SHOW_UPLOADER: return { ...state, isOpenUploader: true }
        case CLOSE_UPLOADER: return { ...state, isOpenUploader: false, files: [] }
        case ADD_UPLOADED_FILE: return { ...state, files: [...state.files, action.payload] }
        case REMOVE_UPLOADED_FILE: return { ...state, files: state.files.filter(file => file.id !== action.payload) }
        case CHANGE_UPLOAD_PROGESS: return {
            ...state, files: 
                state.files.map(file => file.id === action.payload.id
                    ?
                    { ...file, progress: action.payload.progress }
                    :
                    { ...file }
                )        
        }
        case ADD_DATA_TO_FILE: return {
            ...state, files: 
                state.files.map(file => file.id === action.payload.id
                    ?
                    { ...file, ...action.payload.file }
                    :
                    { ...file }
                )
        }
        default:
            return state
    }
}

export const showLoaderAction = () => ({ type: SHOW_UPLOADER })
export const closeLoaderAction = () => ({ type: CLOSE_UPLOADER })
export const addUploadedFilesAction = file => ({ type: ADD_UPLOADED_FILE, payload: file })
export const removeFilesUploadedAction = fileId => ({ type: REMOVE_UPLOADED_FILE, payload: fileId })
export const changeUploadProgressAction = file => ({ type: CHANGE_UPLOAD_PROGESS, payload: file })
export const addDataToUploadedFileAction = (fileId, file) => ({ type: ADD_DATA_TO_FILE, payload: {id: fileId, file} })
