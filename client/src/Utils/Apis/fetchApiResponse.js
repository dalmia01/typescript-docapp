import { routeConstants } from "../Constants/routeConstants";
import history from "../history";

const fetchApiResponse = async (data, additionalHeaderObj = {}) => {
    const initObj = {
        method: data.method,
        headers: {
            "Content-Type": "application/json",
            ...additionalHeaderObj,
        },
        credentials: "include", // TODO: update for prod accordingly
    };
    if (data.method === "POST" || data.method === "PUT") {
        initObj.body = JSON.stringify(data.body);
    }
    try {
        console.log(data.url, initObj);
        const response = await fetch(data.url, initObj);
        if (response.status === 401) {
            // should clear user details
            // and send on login screen
            history.push(routeConstants.LOGOUT);
        }
        const responseBody = await response.json();
        console.log("responseBody ", responseBody);
        return responseBody;
    } catch (e) {
        console.log("error to fetchApiResponse ", e);
        return null;
    }
};

export default fetchApiResponse;
