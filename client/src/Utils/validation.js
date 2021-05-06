import jwtDecode from "jwt-decode";
import { REGEX } from "./Constants/commonConstants";
import { toast } from "react-toastify";
import { DEFAULT_API_ERROR, DEFAULT_SESSION_ERROR } from "./Constants/messageConstants";
import moment from "moment";

/**
 * To check email validation
 * @param {String} value - A string to validate for email
 * @return {Boolean} - true / false acc to validation
 */
export const isEmailValid = (value) => {
    if (REGEX.VALID_EMAIL_REGEX.test(value)) {
        return true;
    }
    return false;
};

/**
 * To check phone number validation
 * @param {String | Number} value - phone number to validate
 * @return {Boolean} - true / false acc to validation
 */
export const isValidPhoneNumber = (value) => {
    if (value.length >= 10 && !isNaN(value)) {
        return true;
    }
    return false;
};

/**
 * To check user validation
 * @param {Object | null} [userInfo = { user: null } ] - an object to validate user
 * @return {Object} - userInfo or default userInfo={user:null}
 */
export const userValidation = (userInfo = { user: null }) => {
    if (localStorage.getItem("token")) {
        const decodedToken = jwtDecode(localStorage.getItem("token"));

        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
        } else {
            userInfo.user = decodedToken;
            userInfo.token = localStorage.getItem("token");
        }
    }

    if (localStorage.getItem("token") === "") userInfo.user = null;

    return userInfo;
};

/**
 * handling common errors - displaying errors, logging out on authorization failure
 * @param {Object } err - errors object to display kind of error
 * @param {function} setAuthLogout - reducer action dispathcer for logging out.
 * @return {void} - nothing
 */
export function handleCommonError(err, setAuthLogout) {
    try {
        if (err.networkError && err.networkError.result.errors[0].message.includes("Authentication")) {
            toast.error(DEFAULT_SESSION_ERROR);
            setAuthLogout();
        } else if (err.graphQLErrors[0].extensions.errors.phone) {
            toast.error(err.graphQLErrors[0].extensions.errors.phone);
        } else if (err.graphQLErrors[0].extensions.errors.general) {
            toast.error(err.graphQLErrors[0].extensions.errors.general);
        }
    } catch (errs) {
        toast.error(DEFAULT_API_ERROR);
    }
}

export function validateDate(s) {
    let separators = ["\\.", "\\-", "\\/"];
    let bits = s.split(new RegExp(separators.join("|"), "g"));
    let d = new Date(bits[2], bits[0] - 1, bits[1]);
    console.log(moment(d), moment(new Date()));
    return moment(new Date()) > moment(d);
}

export function formatDate(s) {
    let separators = ["\\.", "\\-", "\\/"];
    let bits = s.split(new RegExp(separators.join("|"), "g"));
    let d = new Date(bits[2], bits[0] - 1, bits[1]);
    return moment(d);
}
