const defaultState = {
    loader: false,
    search: '',
    createDirPopup: false,
    infoPopup: {
        isOpen: false,
        file: {}
    }
}

const SHOW_LOADER = 'SHOW_LOADER'
const HIDE_LOADER = 'HIDE_LOADER'
const SET_SEARCH = 'SET_SEARCH'
const CLEAN_SEARCH = 'CLEAN_SEARCH'
const SHOW_CREATE_DIR_POPUP = 'SHOW_CREATE_DIR_POPUP'
const HIDE_CREATE_DIR_POPUP = 'HIDE_CREATE_DIR_POPUP'
const SHOW_INFO_POPUP = 'SHOW_INFO_POPUP'
const HIDE_INFO_POPUP = 'HIDE_INFO_POPUP'
const SET_INFO_POPUP = 'SET_INFO_POPUP'
const SET_NAME_INFO_POPUP = 'SET_NAME_INFO_POPUP'

export default function appReducer(state = defaultState, action) {
    switch (action.type) {
        case SHOW_LOADER:
            return { ...state, loader: true }
        case HIDE_LOADER:
            return { ...state, loader: false }
        case SET_SEARCH:
            return { ...state, search: action.payload }
        case CLEAN_SEARCH:
            return { ...state, search: '' }
        case SHOW_CREATE_DIR_POPUP:
            return { ...state, createDirPopup: true }
        case HIDE_CREATE_DIR_POPUP:
            return { ...state, createDirPopup: false }
        case SHOW_INFO_POPUP:
            return { ...state, infoPopup: { ...state.infoPopup, isOpen: true } }
        case HIDE_INFO_POPUP:
            return { ...state, infoPopup: { ...state.infoPopup, isOpen: false } }
        case SET_INFO_POPUP:
            return {
                ...state, infoPopup: {
                    ...state.infoPopup,
                    file: action.payload
                }
            }
        case SET_NAME_INFO_POPUP:
            return {
                ...state, infoPopup: {
                    ...state.infoPopup, file: {
                        ...state.infoPopup.file,
                        name: action.payload
                    }
                }
            }
        default:
            return state
    }
}

export const showLoader = () => ({ type: SHOW_LOADER })
export const hideLoader = () => ({ type: HIDE_LOADER })
export const setSearch = (search) => ({ type: SET_SEARCH, payload: search })
export const cleanSearch = () => ({ type: CLEAN_SEARCH })
export const showCreateDirPopup = () => ({ type: SHOW_CREATE_DIR_POPUP })
export const hideCreateDirPopup = () => ({ type: HIDE_CREATE_DIR_POPUP })
export const showInfoPopup = () => ({ type: SHOW_INFO_POPUP })
export const hideInfoPopup = () => ({ type: HIDE_INFO_POPUP })
export const setInfoPopup = (file) => ({ type: SET_INFO_POPUP, payload: file })
export const setNameInfoPopup = (name) => ({ type: SET_NAME_INFO_POPUP, payload: name })

