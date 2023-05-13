const defaultState = {
    type: '',
    message: ''
}
const SET_FEEDBACK = 'SET_FEEDBACK'

export default function feedbackReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_FEEDBACK:
            return { ...state, type: action.payload.type, message: action.payload.message }
        default:
            return state
    }
}

export const setFeedbackAction = payload => ({ type: SET_FEEDBACK, payload })
