import gql from "graphql-tag";

export const SET_APPOINTMENT_SLOTS = gql`
    mutation($data: String) {
        appointments: setApointmentSlots(data: $data)
    }
`;

export const GET_APPOINTMENTS_SLOTS = gql`
    query($id: String) {
        slots: getAppointmentsSlots(id: $id) {
            slots {
                monday
                tuesday
                wednesday
                thursday
                friday
                saturday
                sunday
            }
        }
    }
`;

export const GET_AVAILABLE_SLOTS = gql`
    query($id: String, $day: String, $date: String) {
        slots: getAvailableSlots(id: $id, day: $day, date: $date)
    }
`;

export const BOOK_APPOINTMENT = gql`
    mutation($patient_id: String, $doctor_id: String, $date: String, $time: String, $day: String) {
        appointment: bookAppointment(patient_id: $patient_id, doctor_id: $doctor_id, date: $date, time: $time, day: $day)
    }
`;
