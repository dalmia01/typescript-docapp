export const GET_DOCTORS = "GET_DOCTORS";
export const GET_DOCTORS_SUCCESS = "GET_DOCTORS_SUCCESS";
export const GET_DOCTORS_FAILURE = "GET_DOCTORS_FAILURE";

export const GET_APPOINTMENTS_SLOTS = "GET_APPOINTMENTS_SLOTS";
export const GET_APPOINTMENTS_SLOTS_SUCCESS = "GET_APPOINTMENTS_SLOTS_SUCCESS";
export const GET_APPOINTMENTS_SLOTS_FAILURE = "GET_APPOINTMENTS_SLOTS_FAILURE";

export const SET_PATIENT_APPOINTMENT = "SET_PATIENT_APPOINTMENT";
export const REMOVE_PATIENT_APPOINTMENT = "REMOVE_PATIENT_APPOINTMENT";

export const getDoctors = () => ({
    type: GET_DOCTORS,
});

export const getDoctorsSuccess = (doctors) => ({
    type: GET_DOCTORS_SUCCESS,
    payload: doctors,
});

export const getDoctorsFailure = () => ({
    type: GET_DOCTORS_FAILURE,
});

export const getAppointmentsSlots = () => ({
    type: GET_APPOINTMENTS_SLOTS,
});

export const getAppointmentsSlotsSuccess = (slots) => ({
    type: GET_APPOINTMENTS_SLOTS_SUCCESS,
    payload: slots,
});

export const getAppointmentsSlotsFailure = () => ({
    type: GET_APPOINTMENTS_SLOTS_FAILURE,
});

export const setPatientAppointment = (patient) => ({
    type: SET_PATIENT_APPOINTMENT,
    payload: patient,
});

export const removePatientAppointment = () => ({
    type: REMOVE_PATIENT_APPOINTMENT,
});

export function setPatientToAppoint(patient) {
    return async (dispatch) => {
        if (patient && Object.keys(patient).length > 0) {
            await dispatch(setPatientAppointment(patient));
        } else {
            await dispatch(removePatientAppointment());
        }
    };
}
