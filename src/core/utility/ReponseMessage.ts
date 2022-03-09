
// ****
// ****  Custom Response format for the Rest Api
// *****
// *****
// ***** @param :
// ****  APP_CODE : -1(error) or 1 (success)
// ****  HTTP_STATUS_CODE : 200/404/500
// ****  MESSAGE : User Defined Message (Success or error)
// ****  Data : Entity

class ResponseMessage {

    httpStatusCode: number | null;
    appCode: number | null;
    message: string;
    data: any;

    constructor(_httpStatusCode?: number, _appCode?: number, _message?: string, _data?: any) {
        this.httpStatusCode = _httpStatusCode || null;
        this.appCode = _appCode || null;
        this.message = _message || "";
        this.data = _data || {};
    }
}


export default ResponseMessage; // *** No singleTon



