import gql from "graphql-tag";

const FILTER_PATIENT = gql`
    query($name_phone: String, $date: String) {
        patient: getPatient(filterInputPatient: { date: $date, name_phone: $name_phone }) {
            id
            first_name
            last_name
            salutation
            phone
            age
            dob
            blood_grp
            sex
            email
            isTracked
            address {
                line_1
                area
                city
                pincode
            }
            bookings {
                id
                doctor_id
                date
                time
            }
            notes
            follow_up_date
            patient_serial_id
            medical_history {
                id
                defination
                name
                data {
                    id
                    label
                    value
                    name
                    operator
                    possible_values
                }
            }
        }
    }
`;

const GET_PATIENT_MEDIA = gql`
    query($id: String!) {
        patient: patient(id: $id) {
            media {
                created_at
                original_name
                filename
                mimetype
            }
        }
    }
`;

const GET_VACCINE_CHART = gql`
    query vaccineChart($id: String) {
        vaccine: vaccineChart(id: $id) {
            id
            updated_at
            due_date
            given_date
            medicine_brand
            medicine_name
            notes
            range
            vaccine_group_name
        }
    }
`;

const CREATE_PATIENT = gql`
    mutation(
        $title: String
        $fname: String
        $lname: String
        $patient_serial_id: String
        $email: String
        $phone: String!
        $dob: Date
        $bloodGroup: String
        $sex: String!
        $line_1: String
        $area: String
        $city: String
        $state: String
        $pincode: String
    ) {
        patient: createPatient(
            patient: {
                title: $title
                first_name: $fname
                last_name: $lname
                patient_serial_id: $patient_serial_id
                email: $email
                phone: $phone
                dob: $dob
                blood_grp: $bloodGroup
                sex: $sex
                address: { line_1: $line_1, area: $area, city: $city, state: $state, pincode: $pincode }
            }
        ) {
            id
            first_name
            last_name
            patient_serial_id
            salutation
            phone
            age
            dob
            blood_grp
            sex
            email
            isTracked
            address {
                line_1
                area
                city
                pincode
            }
            bookings {
                id
                doctor_id
                date
                time
            }
            notes
            follow_up_date
            medical_history {
                id
                defination
                name
                data {
                    id
                    label
                    value
                    name
                    operator
                    possible_values
                }
            }
        }
    }
`;

const EDIT_PATIENT = gql`
    mutation(
        $id: String
        $title: String
        $fname: String
        $lname: String
        $email: String
        $phone: String!
        $dob: Date
        $patient_serial_id: String
        $bloodGroup: String
        $sex: String!
        $line_1: String
        $area: String
        $city: String
        $state: String
        $pincode: String
    ) {
        patient: editPatient(
            patient: {
                id: $id
                title: $title
                first_name: $fname
                last_name: $lname
                email: $email
                phone: $phone
                dob: $dob
                blood_grp: $bloodGroup
                sex: $sex
                patient_serial_id: $patient_serial_id
                address: { line_1: $line_1, area: $area, city: $city, state: $state, pincode: $pincode }
            }
        ) {
            salutation
            first_name
            last_name
            patient_serial_id
            phone
            age
            dob
            blood_grp
            sex
            email
            isTracked
            address {
                line_1
                area
                city
                pincode
            }
        }
    }
`;

const DELETE_PATIENT = gql`
    mutation($id: String) {
        patient: deletePatient(id: $id)
    }
`;

const SAVE_MEDICAL_HISTORY = gql`
    mutation($patient_id: String, $data: String) {
        patient: saveMedicalHistory(patient_id: $patient_id, data: $data) {
            id
            first_name
            last_name
            phone
            age
            dob
            blood_grp
            sex
            email
            isTracked
            address {
                line_1
                area
                city
                pincode
            }
            bookings {
                id
                doctor_id
                date
                time
            }
            notes
            follow_up_date
            medical_history {
                id
                defination
                name
                data {
                    id
                    label
                    value
                    name
                    operator
                    possible_values
                }
            }
        }
    }
`;

const UPDATE_VACCINATION = gql`
    mutation updateVaccineChart($id: String, $data: String) {
        vaccine: updateVaccineChart(id: $id, data: $data) {
            id
            updated_at
            due_date
            given_date
            medicine_brand
            medicine_name
            notes
            range
            vaccine_group_name
        }
    }
`;

const UPDATE_PATIENT_VACCINE_TRACK = gql`
    mutation($id: String, $isTracked: Boolean) {
        patientTrackStatus: updatePatientVaccineTrack(id: $id, isTracked: $isTracked)
    }
`;

export {
    CREATE_PATIENT,
    GET_PATIENT_MEDIA,
    FILTER_PATIENT,
    EDIT_PATIENT,
    DELETE_PATIENT,
    SAVE_MEDICAL_HISTORY,
    UPDATE_VACCINATION,
    GET_VACCINE_CHART,
    UPDATE_PATIENT_VACCINE_TRACK,
};
