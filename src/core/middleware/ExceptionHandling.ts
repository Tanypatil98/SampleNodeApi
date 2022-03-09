import ResponseMessage from "../utility/ReponseMessage";
import { appCode } from "../constants/AppCode";
import { httpStatus } from "../constants/HttpStatusCode";
import CreateResponse from "../utility/CreateResponse";
import { NextFunction, Request, Response } from "express";

// const { traceError } = require("../utility/helper");


export const exceptionHandling = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const createResponse = new CreateResponse();
    const obj = new ResponseMessage();
    obj.appCode = appCode.success;
    obj.httpStatusCode = httpStatus.internalServerError;
    obj.message = err.message;
    createResponse.error(res, obj);
};
