import * as actions from "../actions/authActions";
import jwtDecode from "jwt-decode";

let initialState = {
    user: null,
};

if (localStorage.getItem("token")) {
    const decodedToken = jwtDecode(localStorage.getItem("token"));

    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
    } else {
        initialState.user = decodedToken;
    }
}

export default function AuthReducer(state = initialState, action) {
    switch (action.type) {
        case actions.SET_AUTH_LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
            };
        case actions.SET_AUTH_LOGOUT_SUCCESS:
            return {
                ...state,
                user: null,
            };
        default:
            return state;
    }
}
