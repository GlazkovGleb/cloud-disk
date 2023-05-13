import { baseURL } from '../const/index'
import { hideInfoPopup, hideLoader, showLoader } from '../reducers/appReducer'
import { setFeedbackAction } from '../reducers/feedbackReducer'
import { createDirAction, deleteFilesAction, pasteFileAction, renameFilesAction, setFilesAction } from '../reducers/fileReducer'
import { addDataToUploadedFileAction, addUploadedFilesAction, changeUploadProgressAction, showLoaderAction, } from '../reducers/uploadFilesReducer'
import { setUserAction } from '../reducers/userReducer'


export const getFiles = (api, dirId, sort, search) => {
    return async dispatch => {
        try {
            dispatch(showLoader())
            const response = await api.get('files/', {
                params: {
                    parent: dirId,
                    sort,
                    search
                }
            })
            dispatch(hideLoader())
            dispatch(setFilesAction(response.data))
        } catch (e) {
            dispatch(hideLoader())
            if (e.response.status === 500) {
                dispatch(setFeedbackAction({ type: 'error', message: 'Упс... Произошла ошибка на сервере!' }))
            }
            dispatch(setFeedbackAction({ type: 'error', message: e.response.data.message }))
        }
    }
}

export const createDir = (api, name, parent) => {
    return async dispatch => {
        try {
            const response = await api.post(`files/`,
                {
                    name,
                    parent,
                    type: 'dir'
                }
            )
            dispatch(createDirAction(response.data))
        } catch (e) {
            if (e.response.status === 500) {
                dispatch(setFeedbackAction({ type: 'error', message: 'Упс... Произошла ошибка на сервере!' }))
            }
            dispatch(setFeedbackAction({ type: 'warning', message: e.response.data.message }))
        }
    }
}


export const uploadFiles = (api, file, parent) => {
    return async dispatch => {
        try {
            const form = new FormData()
            form.append('file', file)
            if (parent) {
                form.append('parent', parent)
            }
            const uploadedFile = {
                name: file.name,
                id: Date.now()
            }
            dispatch(showLoaderAction())
            dispatch(addUploadedFilesAction(uploadedFile))

            const response = await api.post(`files/upload/`,
                form,
                {
                    onUploadProgress: progressEvent => {
                        const totalLength = progressEvent.event.lengthComputable ? progressEvent.event.total :
                            progressEvent.event.target.getResponseHeader('content-length')
                            || progressEvent.event.target.getResponseHeader('x-decompressed-content-length');
                        if (totalLength) {
                            uploadedFile.progress = Math.round((progressEvent.loaded * 100) / totalLength)
                            dispatch(changeUploadProgressAction(uploadedFile))
                        }
                    }
                })
            dispatch(addDataToUploadedFileAction(uploadedFile.id, response.data))
        } catch (e) {

            if (e.response.status === 500) {
                dispatch(setFeedbackAction({ type: 'error', message: 'Упс... Произошла ошибка на сервере!' }))
            }
            dispatch(setFeedbackAction({ type: 'warning', message: e.response.data.message }))
        }
    }
}

export const downloadfile = (file) => {
    return async dispatch => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return
            }
            const response = await fetch(`${baseURL}/files/download?id=${file._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            console.log(response);
            if (response.status === 200) {
                const blob = await response.blob()
                const downloadUrl = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = downloadUrl
                link.download = file.name
                document.body.appendChild(link)
                link.click()
                link.remove()
                dispatch(setFeedbackAction({ type: 'success', message: 'Загрузка файла началась!' }))
            } else {
                dispatch(setFeedbackAction({ type: 'error', message: 'Упс... Произошла ошибка при загрузке файла!' }))
            }

        } catch (e) {
            if (e.response.status === 500) {
                dispatch(setFeedbackAction({ type: 'error', message: 'Упс... Произошла ошибка на сервере!' }))
            }
            dispatch(setFeedbackAction({ type: 'warning', message: e.response.data.message }))
        }
    }
}

export const deleteFile = (api, file) => {
    return async dispatch => {
        try {
            const response = await api.delete('files',
                {
                    params: {
                        id: file._id,
                        parent: file.parent
                    }
                })
            dispatch(deleteFilesAction(file._id))
            dispatch(setFeedbackAction({ type: 'success', message: response.data.message }))
        } catch (e) {
            if (e.response.status === 500) {
                dispatch(setFeedbackAction({ type: 'error', message: 'Упс... Произошла ошибка на сервере!' }))
            }
            dispatch(setFeedbackAction({ type: 'error', message: e.response.data.message }))
        }
    }
}

export const uploadAvatar = (api, file) => {
    return async dispatch => {
        try {
            const form = new FormData()
            form.append('file', file)
            const response = await api.post(
                `files/avatar/`,
                form
            )
            dispatch(setUserAction(response.data))
        } catch (e) {
            if (e.response.status === 500) {
                dispatch(setFeedbackAction({ type: 'error', message: 'Упс... Произошла ошибка на сервере!' }))
            }
            dispatch(setFeedbackAction({ type: 'warning', message: e.response.data.message }))
        }
    }
}

export const deleteAvatar = (api) => {
    return async dispatch => {
        try {
            const response = await api.delete(`files/avatar/`)
            dispatch(setUserAction(response.data))
        } catch (e) {
            if (e.response.status === 500) {
                dispatch(setFeedbackAction({ type: 'error', message: 'Упс... Произошла ошибка на сервере!' }))
            }
            dispatch(setFeedbackAction({ type: 'warning', message: e.response.data.message }))
        }
    }
}

export const pasteFile = (api, file, parent) => {
    return async dispatch => {
        try {
            const response = await api.get(
                'files/paste/',
                {
                    params: {
                        file,
                        parent
                    }
                }
            )
            dispatch(pasteFileAction(response.data))
        } catch (e) {
            if (e.response.status === 500) {
                dispatch(setFeedbackAction({ type: 'error', message: 'Упс... Произошла ошибка на сервере!' }))
            }
            dispatch(setFeedbackAction({ type: 'warning', message: e.response.data.message }))
        }
    }
}

export const cutAndPasteFile = (api, id, oldParent, newParent) => {
    return async dispatch => {
        try {
            const response = await api.post(
                'files/cut_and_paste/',
                {
                    id, 
                    oldParent, 
                    newParent
                }
            )
            dispatch(pasteFileAction(response.data))
        } catch (e) {
            if (e.response.status === 500) {
                dispatch(setFeedbackAction({ type: 'error', message: 'Упс... Произошла ошибка на сервере!' }))
            }
            dispatch(setFeedbackAction({ type: 'warning', message: e.response.data.message }))
        }
    }
}

export const renameFile = (api, id, name) => {
    return async dispatch => {
        try {
            const response = await api.post(
                'files/rename/',
                {
                    id, 
                    name
                }
            )
            console.log(response);
            dispatch(renameFilesAction(response.data))
            dispatch(hideInfoPopup())
        } catch (e) {
            if (e.response.status === 500) {
                dispatch(setFeedbackAction({ type: 'error', message: 'Упс... Произошла ошибка на сервере!' }))
            }
            dispatch(setFeedbackAction({ type: 'warning', message: e.response.data.message }))
        }
    }
}