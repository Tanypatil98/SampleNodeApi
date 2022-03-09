import { Response } from "express";
import { appCode } from "../constants/AppCode";
import { httpStatus } from "../constants/HttpStatusCode";
import ResponseMessage from "./ReponseMessage";

class CreateResponse {

    success(res: Response, ResponseMessageObj: ResponseMessage) {

        if (!ResponseMessageObj.httpStatusCode) {
            ResponseMessageObj.httpStatusCode = httpStatus.ok;
        }

        if (!ResponseMessageObj.appCode) {
            ResponseMessageObj.appCode = appCode.success;
        }

        res.status(httpStatus.ok);
        res.send(ResponseMessageObj);

    }

    error(res: Response, ResponseMessageObj: ResponseMessage) {
        if (!ResponseMessageObj.httpStatusCode) {
            ResponseMessageObj.httpStatusCode = httpStatus.internalServerError;
        }

        if (!ResponseMessageObj.appCode) {
            ResponseMessageObj.appCode = appCode.error;
        }

        res.status(httpStatus.internalServerError);
        res.send(ResponseMessageObj);

    }

}
export default CreateResponse;
