import ResponseMessage from "../utility/ReponseMessage";
import { appCode } from "../constants/AppCode";
import { httpStatus } from "../constants/HttpStatusCode";
import {
    unAuthorisedMessage,
    tokenNotFoundMessage,
    invalidToken
} from "../../constants/MessageConstant";
import { AuthService } from "../../services/auth/AuthService";
import logger from "../Logger";
import AppError from "../utility/AppError";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authorization = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let bearerToken: any;
            const userAuthService = new AuthService();
            // @ get services for container

            const obj = new ResponseMessage();
            obj.httpStatusCode = httpStatus.unAuthorised;
            obj.appCode = appCode.error;

            // if (req.query && Object.prototype.hasOwnProperty.call(req.query, "access_token")) {
            //     req.headers.authorization = `Bearer ${req.query.access_token}`;
            // }
            // // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
            // if (req.query && typeof req.headers.authorization === "undefined") {
            //     req.headers.authorization = `Bearer ${req.cookies.token}`;
            // }

            // @** Get bearer token from header
            if (
                Object.prototype.hasOwnProperty.call(req.headers, "authorization") ||
                Object.prototype.hasOwnProperty.call(req.headers, "x-access-token")) {
                const token = req.headers.authorization;
                logger.info(token);
                if (token && token.startsWith("Bearer ")) {
                    bearerToken = token.split(" ")[1];
                }
            }
            if (!bearerToken) {
                obj.message = tokenNotFoundMessage;
                return res.status(httpStatus.unAuthorised).send(obj);
            } else {
                try {
                    const decode: any = jwt.verify(bearerToken,process.env.JWT_KEY);
                    if (!decode) {
                        throw new AppError(invalidToken);
                    }
                    const user = await userAuthService.findUserById(decode.userId);
                    logger.info(user);
                    req.user = user; // @inject user in the request Session i.e stateless protocol
                    next(); //@ by pass to the next request or middleware
                } catch (tokenError) {
                    logger.error(`###tokenError ${tokenError}`);
                    obj.message = unAuthorisedMessage;
                    return res.status(httpStatus.unAuthorised).send(obj);
                }
            }
        } catch (error) {
            next(error);
        }
    };
};
