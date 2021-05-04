export const STATUS_CODE = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNSUPPORTED_ACTION: 405,
    VALIDATION_FAILED: 422,
    SERVER_ERROR: 500,
    CREATED: 201,
    USER_ALREADY_EXISTS: 406,
    FUNCTIONAL_ERROR: 410,
};

export function statusMessage(status: number): string {
    switch (status) {
        case STATUS_CODE.BAD_REQUEST:
            return "Bad Request";
        case STATUS_CODE.UNAUTHORIZED:
            return "Unauthorized";
        case STATUS_CODE.FORBIDDEN:
            return "Forbidden";
        case STATUS_CODE.NOT_FOUND:
            return "Not Found";
        case STATUS_CODE.UNSUPPORTED_ACTION:
            return "Unsupported Action";
        case STATUS_CODE.VALIDATION_FAILED:
            return "Validation Failed";
        case STATUS_CODE.SERVER_ERROR:
            return "Internal Server Error";
        case STATUS_CODE.CREATED:
            return "Created";
        case STATUS_CODE.USER_ALREADY_EXISTS:
            return "user already exists!";
        case STATUS_CODE.FUNCTIONAL_ERROR:
            return "functional error!";
    }
}
