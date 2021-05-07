import gql from "graphql-tag";

const LOGIN_MUTATION = gql`
    mutation sigInUser($phone: String!, $password: String!) {
        sigInUser(signInInput: { phone: $phone, password: $password }) {
            id
            first_name
            last_name
            phone
            created_at
            updated_at
            token
        }
    }
`;

const RESET_PASSWORD = gql`
    mutation resetPassword($oldPassword: String!, $newPassword: String!) {
        resetPassword(oldPassword: $oldPassword, newPassword: $newPassword)
    }
`;

const FORGET_PASSWORD = gql`
    mutation forgetUserPassword($phone: String!) {
        forgetUserPassword(phone: $phone)
    }
`;

const CREATE_USER = gql`
    mutation(
        $title: String
        $sex: String
        $age: String
        $fname: String
        $lname: String
        $phone: String
        $password: String
        $designation: String
        $role: String
        $email: String
        $line: String
        $area: String
        $city: String
        $state: String
        $pincode: String
        $clinics: String
    ) {
        user: createUser(
            user: {
                title: $title
                gender: $sex
                age: $age
                first_name: $fname
                last_name: $lname
                phone: $phone
                password: $password
                designation: $designation
                role: $role
                email: $email
                address: { line: $line, area: $area, city: $city, state: $state, pincode: $pincode }
                clinics: $clinics
            }
        ) {
            id
            first_name
        }
    }
`;

const EDIT_USER = gql`
    mutation(
        $title: String
        $sex: String
        $age: String
        $fname: String
        $lname: String
        $phone: String
        $designation: String
        $role: String
        $email: String
        $line: String
        $area: String
        $city: String
        $state: String
        $pincode: String
        $clinics: String
    ) {
        user: editUser(
            user: {
                title: $title
                gender: $sex
                age: $age
                first_name: $fname
                last_name: $lname
                phone: $phone
                designation: $designation
                role: $role
                email: $email
                address: { line: $line, area: $area, city: $city, state: $state, pincode: $pincode }
                clinics: $clinics
            }
        ) {
            id
            first_name
        }
    }
`;

const DELETE_USER = gql`
    mutation($phone: String) {
        phone: deleteUser(phone: $phone)
    }
`;

const FETCH_USERS = gql`
    query($filter: String, $unique_id: String) {
        users: fetchUsers(filter: $filter, unique_id: $unique_id) {
            id
            title
            gender
            age
            first_name
            last_name
            phone
            role
            designation
            email
            address {
                line
                area
                city
                state
                pincode
            }
            active_status
            clinic {
                id
                clinic_name
            }
        }
    }
`;

export const USER_ACTIVE_STATUS = gql`
    mutation($userId: String, $activeStatus: Boolean) {
        user: userActiveStatus(userId: $userId, activeStatus: $activeStatus) {
            id
            title
            gender
            age
            first_name
            last_name
            phone
            role
            designation
            email
            address {
                line
                area
                city
                state
                pincode
            }
            active_status
            clinic {
                id
                clinic_name
            }
        }
    }
`;

export { LOGIN_MUTATION, RESET_PASSWORD, FORGET_PASSWORD, CREATE_USER, EDIT_USER, DELETE_USER, FETCH_USERS };
