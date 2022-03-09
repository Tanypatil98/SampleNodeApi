import { AppCode, appCode } from "../../constants/AppCode";
import { httpStatusCode, httpStatus } from "../../constants/HttpStatusCode";
import CreateResponse from "./CreateResponse";

abstract class BaseController {

    static httpStatusCode: httpStatusCode;
    static appCode: AppCode;
    static createResponse: CreateResponse;
    BaseController: any;
}


BaseController.appCode = appCode;
BaseController.httpStatusCode = httpStatus;
BaseController.createResponse = new CreateResponse();

export default BaseController;