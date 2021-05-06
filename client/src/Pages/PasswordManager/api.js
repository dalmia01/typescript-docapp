import fetchApiResponse from "../../Utils/Apis/fetchApiResponse";
import { FORGOT_PASSWORD, RESET_PASSWORD } from "../../Utils/Apis/constants";

const makeForgotPasswordCall = async ({ email }) => {
    const req = {
        url: FORGOT_PASSWORD,
        method: "POST",
        body: {
            email,
        },
    };
    const resp = await fetchApiResponse(req);
    return resp;
};

const makeResetPasswordCall = async ({ token, newPassword }) => {
    const req = {
        url: RESET_PASSWORD,
        method: "POST",
        body: {
            token,
            newPassword,
        },
    };
    const resp = await fetchApiResponse(req);
    return resp;
};

export default {
    makeForgotPasswordCall,
    makeResetPasswordCall,
};
