import gql from "graphql-tag";

export const FETCH_PRESCRIPTIONS = gql`
    query getPrescriptions($id: String) {
        prescriptions: getPrescriptions(getPrescriptionInput: { id: $id }) {
            id
            patient
            doctor {
                id
                first_name
                last_name
                title
                designation
            }
            updatedAt
            symptoms {
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
            findings {
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
            diagnosis {
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
            investigations {
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
            instructions {
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
            medicines {
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
            vitals {
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
            additional_notes
        }
    }
`;

export const SAVE_PRESCRIPTION = gql`
    mutation($data: String) {
        prescription: prescription(data: $data)
    }
`;

export const DELETE_PRESCRIPTION = gql`
    mutation($id: String) {
        prescription: deletePrescription(id: $id)
    }
`;

export const GET_FAVOURITE_PRESCRIPTIONS = gql`
    query {
        prescription: getFavouritePrescriptions {
            id
            fav_name
            symptoms {
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
            findings {
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
            diagnosis {
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
            investigations {
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
            instructions {
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
            medicines {
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
            vitals {
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
            additional_notes
        }
    }
`;

export const REMOVE_FAVOURITE_PRESCRIPTION = gql`
    mutation($id: String) {
        prescriptions: removeFavouritePrescription(id: $id) {
            id
            fav_name
            symptoms {
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
            findings {
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
            diagnosis {
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
            investigations {
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
            instructions {
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
            medicines {
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
            vitals {
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
            additional_notes
        }
    }
`;
