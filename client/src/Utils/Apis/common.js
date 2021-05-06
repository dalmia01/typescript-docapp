export const isValidResponse = (response) => {
    if (!response) {
        return false;
    }
    if (typeof response.isSuccess !== "boolean") {
        return false;
    }
    if (response.isSuccess === true && !response.data) {
        return false;
    }
    if (response.isSuccess === false && !(response.error && response.error.errorMsg)) {
        return false;
    }
    return true;
};
