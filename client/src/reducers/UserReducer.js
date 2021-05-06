import * as actions from "../actions/userActions";

export const initialState = {
    loading: false,
    hasErrors: false,
    doctors: [],
    slots: {},
    patient: {},
};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case actions.GET_DOCTORS:
            return { ...state, loading: true };
        case actions.GET_DOCTORS_SUCCESS:
            return { ...state, doctors: action.payload, loading: false, hasErrors: false };
        case actions.GET_DOCTORS_FAILURE:
            return { ...state, loading: false, hasErrors: true };
        case actions.GET_APPOINTMENTS_SLOTS:
            return { ...state, loading: true };
        case actions.GET_APPOINTMENTS_SLOTS_SUCCESS:
            return { ...state, slots: action.payload, loading: false, hasErrors: false };
        case actions.GET_APPOINTMENTS_SLOTS_FAILURE:
            return { ...state, loading: false, hasErrors: true };
        case actions.SET_PATIENT_APPOINTMENT:
            return { ...state, patient: action.payload };
        case actions.REMOVE_PATIENT_APPOINTMENT:
            return { ...state, patient: {} };
        default:
            return state;
    }
}
