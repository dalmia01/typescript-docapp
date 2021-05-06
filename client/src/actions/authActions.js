export const SET_AUTH_LOGIN_SUCCESS = "SET_AUTH_LOGIN_SUCCESS";

export const SET_AUTH_LOGOUT_SUCCESS = "SET_AUTH_LOGOUT_SUCCESS";

export const setAuthLoginSuccess = (user) => ({
    type: SET_AUTH_LOGIN_SUCCESS,
    payload: user,
});

export const setAuthLogoutSucess = () => ({
    type: SET_AUTH_LOGOUT_SUCCESS,
});

/**
 * user login
 * @param {Object} user - get user detials from graphql login request
 * @return {function} dispatch - login, logout dispatcher function
 */
export function setAuthLogin(user) {
    return async (dispatch) => {
        try {
            localStorage.setItem("token", user.token);
            await dispatch(setAuthLoginSuccess(user));
        } catch (err) {
            localStorage.removeItem("token");
            await dispatch(setAuthLogoutSucess());
        }
    };
}

/**
 * user logout
 * @return {function} dispatch - logout dispatcher function
 */
export function setAuthLogout() {
    return async (dispatch) => {
        try {
            localStorage.removeItem("token");
            await dispatch(setAuthLogoutSucess());
        } catch (err) {
            localStorage.removeItem("token");
            await dispatch(setAuthLogoutSucess());
        }
    };
}
