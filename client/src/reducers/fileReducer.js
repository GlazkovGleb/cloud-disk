const defaultState = {
    files: [],
    currentDir: {
        _id: null,
        name: 'Главная'
    },
    dirStack: [],
    view: 'list',
    buffer: {
        type: '',
        data: {}
    }
}

const SET_FILES = 'SET_FILES'
const SET_CURRENT_DIR = 'SET_CURRENT_DIR'
const CREATE_DIR = 'CREATE_DIR'
const ADD_FILES = 'ADD_FILES'
const PASTE_FILE = 'PASTE_FILE'
const DELETE_FILE = 'DELETE_FILE'
const RENAME_FILE = 'RENAME_FILE'
const PUSH_TO_STACK = 'PUSH_TO_STACK'
const UPDATE_STACK = 'UPDATE_STACK'
const SET_VIEW = 'SET_VIEW'
const SET_BUFFER = 'SET_BUFFER'
const CLEAN_BUFFER = 'CLEAN_BUFFER'

export default function fileReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_FILES: return { ...state, files: action.payload }
        case SET_CURRENT_DIR: return { ...state, currentDir: action.payload }
        case CREATE_DIR: return { ...state, files: [...state.files, action.payload] }
        case ADD_FILES: return { ...state, files: [...state.files, ...action.payload] }
        case PASTE_FILE: return { ...state, files: [...state.files, action.payload] }
        case DELETE_FILE: return { ...state, files: state.files.filter(file => file._id !== action.payload) }
        case RENAME_FILE: return {
            ...state, files: state.files.map(
                file =>
                    file._id === action.payload._id
                        ? action.payload
                        : file
            )
        }
        case PUSH_TO_STACK: return {
            ...state, dirStack: [...state.dirStack, {
                _id: action.payload._id,
                name: action.payload.name
            }]
        }
        case UPDATE_STACK: return { ...state, dirStack: action.payload }
        case SET_VIEW: return { ...state, view: action.payload }
        case SET_BUFFER: return {
            ...state, buffer: {
                type: action.payload.type,
                data: action.payload.data
            }
        }
        case CLEAN_BUFFER: return { ...state, buffer: {} }
        default:
            return state
    }
}

export const setFilesAction = files => ({ type: SET_FILES, payload: files })
export const setCurrentDirAction = file => ({ type: SET_CURRENT_DIR, payload: file })
export const createDirAction = dir => ({ type: CREATE_DIR, payload: dir })
export const addFilesAction = files => ({ type: ADD_FILES, payload: files })
export const deleteFilesAction = fileId => ({ type: DELETE_FILE, payload: fileId })
export const renameFilesAction = (file) => ({ type: RENAME_FILE, payload: file })
export const pushToStackAction = (_id, name) => ({ type: PUSH_TO_STACK, payload: { _id, name } })
export const updateStackAction = updatedStack => ({ type: UPDATE_STACK, payload: updatedStack })
export const setView = view => ({ type: SET_VIEW, payload: view })
export const setBuffer = (type, data) => ({ type: SET_BUFFER, payload: { type, data } })
export const cleanBuffer = () => ({ type: CLEAN_BUFFER })
export const pasteFileAction = file => ({ type: PASTE_FILE, payload: file })





