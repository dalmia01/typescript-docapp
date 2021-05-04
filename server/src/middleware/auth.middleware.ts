import { AuthenticationError } from "apollo-server-errors";
import { statusMessage } from "../constants/message.constants";
import { verifyJWTAccessToken } from "../helpers/common.helpers";

export const verifyUser = async (req: any) => {
    if (["sigInUser", "forgetUserPassword", "createUser"].indexOf(req.body.operationName) > -1) {
        return;
    }

    const authorizationHeader = req.headers["authorization"];

    const token = authorizationHeader && authorizationHeader.split(" ")[1];

    if (!token) throw new AuthenticationError(statusMessage(401));

    try {
        const user = verifyJWTAccessToken(token);
        return user;
    } catch (err) {
        throw new AuthenticationError(statusMessage(401));
    }
};
