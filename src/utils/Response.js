export function response(status, success, message, data) {
    return {
        meta: {
            status,
            success,
            message
        },
        data
    };
}

export function response200(message, data) {
    return {
        meta: {
            status: 200,
            success: true,
            message: message || "OK"
        },
        data
    };
}

export function response201(message, data) {
    return {
        meta: {
            status: 201,
            success: true,
            message: message || "Created"
        },
        data
    };
}

export function response400(message) {
    return {
        meta: {
            status: 400,
            success: false,
            message: message || "Bad Request"
        }
    };
}

export function response401(message) {
    return {
        meta: {
            status: 401,
            success: false,
            message: message || "Unauthorized"
        }
    };
}

export function response403(message) {
    return {
        meta: {
            status: 403,
            success: false,
            message: message || "Forbidden"
        }
    };
}

export function response404(message) {
    return {
        meta: {
            status: 404,
            success: false,
            message: message || "Not Found"
        }
    };
}

export function response409(message) {
    return {
        meta: {
            status: 409,
            success: false,
            message: message || "Conflict"
        }
    };
}

export function response500(message) {
    return {
        meta: {
            status: 500,
            success: false,
            message: message || "Internal Server Error"
        }
    };
}


