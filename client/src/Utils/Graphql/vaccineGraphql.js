import gql from "graphql-tag";

export const FETCH_VACCINE_CHART = gql`
    query {
        chart {
            ranges {
                start_range
                end_range
                range_unit
                range_label
            }
            vaccine_group {
                vaccine_group_name
                schedule {
                    range
                    medicine_name
                    medicine_brands
                }
            }
        }
    }
`;

export const FILTER_VACCINE_GIVEN_PATIENT = gql`
    query($filter: String) {
        patients: getGivenVaccinePatients(filter: $filter) {
            id
            first_name
            last_name
            age
            dob
            vaccine {
                vaccine_group_name
                medicine_name
                medicine_brand
                notes
                given_date
                due_date
            }
        }
    }
`;

export const FILTER_VACCINE_DUE_PATIENT = gql`
    query($filter: String) {
        patients: getDueVaccinePatients(filter: $filter) {
            id
            first_name
            last_name
            age
            dob
            vaccine {
                vaccine_group_name
                medicine_name
                medicine_brand
                notes
                given_date
                due_date
            }
        }
    }
`;
