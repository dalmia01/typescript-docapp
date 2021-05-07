import gql from "graphql-tag";

const ADD_DEFINITION = gql`
    mutation commonDefinition($id: String, $name: String, $fields: String, $category: String, $patient_id: String) {
        defination: commonDefinition(
            commonDefinitonInput: { id: $id, name: $name, fields: $fields, category: $category, patient_id: $patient_id }
        ) {
            id
            name
            category
            description
            dosageForm
            fields {
                id
                name
                operator
                label
                possible_values
            }
            is_fav
        }
    }
`;

const UPDATE_DEFINITION = gql`
    mutation editCommonDefination($defination: String) {
        defination: editCommonDefination(defination: $defination) {
            id
            name
            category
            description
            dosageForm
            fields {
                id
                name
                operator
                label
                possible_values
            }
            is_fav
        }
    }
`;

const DELETE_DEFINITION_FIELD = gql`
    mutation deleteCommonDefinationField($defination: String) {
        defination: deleteCommonDefinationField(defination: $defination) {
            id
            name
            category
            description
            dosageForm
            fields {
                id
                name
                operator
                label
                possible_values
            }
            is_fav
        }
    }
`;

const SPECIFIC_DEFINITION = gql`
    query specificDefination($category: String, $id: String) {
        defination: specificDefination(specificDefintionInput: { category: $category, id: $id }) {
            id
            name
            category
            description
            dosageForm
            fields {
                id
                name
                operator
                label
                possible_values
                value
            }
            is_fav
        }
    }
`;

const FETCH_DEFINITIONS = gql`
    query fetchDefinations($category: String) {
        definations: fetchDefinations(category: $category) {
            id
            name
            category
            description
            dosageForm
            fields {
                id
                name
                operator
                label
                possible_values
                value
            }
            is_fav
        }
    }
`;

const FETCH_FILTERED_DEFINITIONS = gql`
    query fetchFilteredDefinations($category: String, $someId: String, $filteredValue: String) {
        definations: fetchFilteredDefinations(
            fetchFilterDefinitionInput: { category: $category, someId: $someId, filteredValue: $filteredValue }
        ) {
            id
            name
            category
            description
            dosageForm
            fields {
                id
                name
                operator
                label
                possible_values
                value
            }
            is_fav
        }
    }
`;

const ADD_DEFINITION_NAME = gql`
    mutation addDefinationName($name: String, $category: String) {
        defination: addDefinationName(addDefinationNameInput: { name: $name, category: $category }) {
            id
            name
            category
            description
            dosageForm
            fields {
                id
                label
                operator
                name
                possible_values
            }
            is_fav
        }
    }
`;

const DELETE_DEFINITION = gql`
    mutation deleteCommonDefination($id: String) {
        defination: deleteCommonDefination(id: $id)
    }
`;

const FAVOURITE_MEDICINE_VALUES = gql`
    mutation favouriteMedicineValues($defination: String) {
        defination: favouriteMedicineValues(defination: $defination)
    }
`;

const REMOVE_FAVOURITE_MEDICINE_VALUES = gql`
    mutation removeFavouriteMedicineValues($definationID: String) {
        defination: removeFavouriteMedicineValues(defination_id: $definationID)
    }
`;

const ADD_MEDICINE_MUTATION = gql`
    mutation addMedicineDefinationName($name: String, $description: String, $dosageForm: String, $category: String) {
        defination: addMedicineDefinationName(
            addMedicineDefinationInput: { name: $name, description: $description, dosageForm: $dosageForm, category: $category }
        ) {
            id
            name
            category
            description
            dosageForm
            fields {
                id
                label
                operator
                name
                possible_values
            }
            is_fav
        }
    }
`;

const EDIT_MEDICINE_MUTATION = gql`
    mutation editMedicineDefinationName($name: String, $description: String, $dosageForm: String, $category: String) {
        defination: editMedicineDefinationName(
            editCommonDefinitonInput: { name: $name, description: $description, dosageForm: $dosageForm, category: $category }
        ) {
            id
            name
            category
            description
            dosageForm
            fields {
                id
                label
                operator
                name
                possible_values
            }
            is_fav
        }
    }
`;

export {
    ADD_DEFINITION,
    ADD_DEFINITION_NAME,
    FETCH_DEFINITIONS,
    FETCH_FILTERED_DEFINITIONS,
    SPECIFIC_DEFINITION,
    UPDATE_DEFINITION,
    DELETE_DEFINITION_FIELD,
    DELETE_DEFINITION,
    FAVOURITE_MEDICINE_VALUES,
    REMOVE_FAVOURITE_MEDICINE_VALUES,
    ADD_MEDICINE_MUTATION,
    EDIT_MEDICINE_MUTATION,
};
