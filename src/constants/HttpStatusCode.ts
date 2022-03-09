export type httpStatusCode = {
    ok: number,
    acceptedNotComplete: number,
    notFound: number,
    unAuthorized: number,
    internalServerError: number,
    badRequest: number,
    forbidden: number
};

export const httpStatus: httpStatusCode = Object.freeze({
    ok: 200,
    acceptedNotComplete: 202,
    notFound: 404,
    unAuthorized: 401,
    internalServerError: 500,
    badRequest: 400,
    forbidden: 403
});