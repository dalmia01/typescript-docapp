import gql from "graphql-tag";

export const SEND_OTP_BOOKING = gql`
    mutation($first_name: String, $last_name: String, $phone: String) {
        patientBooking: sendOtpPatientBooking(first_name: $first_name, last_name: $last_name, phone: $phone)
    }
`;

export const BOOK_APPOINTMENT_BY_PATIENT = gql`
    mutation(
        $first_name: String
        $last_name: String
        $phone: String
        $doctor_id: String
        $date: String
        $time: String
        $day: String
        $otp: String
        $hash: String
    ) {
        patientBooking: confirmBookingByPatient(
            first_name: $first_name
            last_name: $last_name
            phone: $phone
            doctor_id: $doctor_id
            date: $date
            time: $time
            day: $day
            otp: $otp
            hash: $hash
        )
    }
`;
