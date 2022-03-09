// import ResponseMessage from "../utility/ReponseMessage";
// import { appCode } from "../constants/AppCode";
// import { httpStatus } from "../constants/HttpStatusCode";
// import {
//     unAuthorisedMessage,
//     tokenNotFoundMessage,
//     invalidToken
// } from "../../constants/MessageConstant";
// import logger from "../Logger";
// import AppError from "../utility/AppError";
// import { AuthService } from "../../services/auth/AuthService";
// import { Request, Response, NextFunction } from "express";

// export const authorizationApp = () => {
//     return async (
//         req: Request,
//         res: Response,
//         next: NextFunction
//     ) => {
//         try {
//             let bearerToken: any;
//             const userAuthService = new AuthService();
//             const obj = new ResponseMessage();
//             obj.httpStatusCode = httpStatus.unAuthorised;
//             obj.appCode = appCode.error;

//             if (req.query && Object.prototype.hasOwnProperty.call(req.query, "access_token")) {
//                 req.headers.authorization = `Bearer ${req.query.access_token}`;
//             }
//             // @** Get bearer token from header
//             if (
//                 Object.prototype.hasOwnProperty.call(req.headers, "authorization") ||
//                 Object.prototype.hasOwnProperty.call(req.headers, "x-access-token")) {
//                 const token = req.headers.authorization;
//                 if (token && token.startsWith("Bearer ")) {
//                     bearerToken = token.split(" ")[1];
//                 }
//             }
//             if (!bearerToken) {
//                 obj.message = tokenNotFoundMessage;
//                 return res.status(httpStatus.unAuthorised).send(obj);
//             } else {
//                 try {
//                     const customerId = await userAuthService.verifyCustomerToken(bearerToken);
//                     (req as any).user = { id: customerId };
//                     if (!customerId) {
//                         throw new AppError(invalidToken);
//                     }
//                     next(); //@ by pass to the next request or middleware
//                 } catch (tokenError) {
//                     logger.error(`###tokenError ${JSON.stringify(tokenError)}`);
//                     obj.message = unAuthorisedMessage;
//                     return res.status(httpStatus.unAuthorised).send(obj);
//                 }
//             }
//         } catch (error) {
//             next(error);
//         }
//     };
// };
