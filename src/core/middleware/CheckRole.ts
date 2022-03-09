import logger from "../Logger";
import ResponseMessage from "../utility/ReponseMessage";
import { httpStatus } from "../constants/HttpStatusCode";
import {
    unAuthorisedMessage
} from "../../constants/MessageConstant";
import { Request, Response, NextFunction } from "express";

const checkRole = (text: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            logger.info(req.user.permissions);
            if(req.user.permissions.includes(text)){
                next();
            }else{
                const obj = new ResponseMessage();
                obj.message = unAuthorisedMessage;
                return res.status(401).send(obj);
            }
        }catch(err){
            next(err); 
        }
    }
}

module.exports = checkRole;