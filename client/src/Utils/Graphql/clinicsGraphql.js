import gql from "graphql-tag";

export const FETCH_CLINICS = gql`
    query($filter: String, $unique_id: String) {
        clinics: fetchClinics(filter: $filter, unique_id: $unique_id) {
            id
            clinic_name
            address
            phone_num
            website
        }
    }
`;

export const ADD_CLINIC = gql`
    mutation($clinicName: String, $address: String, $phoneNum: String, $website: String) {
        clinic: addClinic(clinic: { clinic_name: $clinicName, address: $address, phone_num: $phoneNum, website: $website }) {
            id
            clinic_name
            address
            phone_num
            website
        }
    }
`;
