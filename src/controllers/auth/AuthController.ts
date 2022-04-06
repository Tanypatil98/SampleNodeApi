import BaseController from "../../core/utility/BaseController";
import ReponseMessage from "../../core/utility/ReponseMessage";
import logger from "../../core/Logger";
import { AuthService } from "../../services/auth/AuthService";
import { Request, Response, NextFunction } from "express";


export default class AuthController extends BaseController {
    // async signIn(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         logger.info(" Starting Sign In");
    //         const authService = new AuthService();
    //         const responseObj = new ReponseMessage();
    //         const dataIn = await authService.signIn(req.body);
    //         logger.debug(dataIn);
    //         if (dataIn) {
    //             responseObj.data = dataIn;
    //             BaseController.createResponse.success(res, responseObj);
    //         }
    //     } catch (error) {
    //         logger.error(error);
    //         next(error);
    //     }
    // }
    // async registerAdmin(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         logger.info(" Starting Registeration");
    //         const authService = new AuthService();
    //         const responseObj = new ReponseMessage();
    //         const data = await authService.registerAdmin(req.body);
    //         logger.debug(data);
    //         if (data) {
    //             responseObj.httpStatusCode = 200;
    //             responseObj.message = "Registered Successfully";
    //             responseObj.data = data;
    //             BaseController.createResponse.success(res, responseObj);
    //         }
    //     } catch (error) {
    //         logger.error(error);
    //         next(error);
    //     }
    // }

    // async forgotPassword(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         logger.info(" Starting Forgot Passord");
    //         const authService = new AuthService();
    //         const responseObj = new ReponseMessage();
    //         const data = await authService.forgotPassword(req.body);
    //         logger.debug(data);
    //         if (data) {
    //             responseObj.httpStatusCode = 200;
    //             responseObj.message = data;
    //             BaseController.createResponse.success(res, responseObj);
    //         }
    //     } catch (error) {
    //         logger.error(error);
    //         next(error);
    //     }
    // }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Started Execution for findUserById ==>");
            logger.info(req.params.uid);
            const responseObj = new ReponseMessage();
            const authService = new AuthService();
            responseObj.httpStatusCode = 200;
            responseObj.data = await authService.findUserById(req.params.uid);
            BaseController.createResponse.success(res, responseObj);
        } catch (error) {
            logger.error(
                `Error in find User ${error}`
            );
            return next(error);
        }
    };

    async getReferral(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Started Execution for findUserReferral ==>");
            logger.info(req.params.uid);
            const responseObj = new ReponseMessage();
            const authService = new AuthService();
            responseObj.httpStatusCode = 200;
            responseObj.data = await authService.getReferral(req.params.uid);
            BaseController.createResponse.success(res, responseObj);
        } catch (error) {
            logger.error(
                `Error in find User Referral ${error}`
            );
            return next(error);
        }
    };

    async updateUserById(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Started Execution for findUserById ==>");
            logger.info(req.params.uid);
            const responseObj = new ReponseMessage();
            const authService = new AuthService();
            responseObj.httpStatusCode = 200;
            responseObj.message = await authService.updateUserById(req.params.uid, req.body);
            BaseController.createResponse.success(res, responseObj);
        } catch (error) {
            logger.error(
                `Error in update User ${error}`
            );
            return next(error);
        }


    };

    async deleteUserById(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Started Execution for deleteUserByid ==>");
            const responseObj = new ReponseMessage();
            const authService = new AuthService();
            responseObj.httpStatusCode = 200;
            responseObj.data = await authService.deleteUserById({ _id: req.params.id });
            BaseController.createResponse.success(res, responseObj);
        } catch (error) {
            logger.error(
                `Error in delete User ${error}`
            );
            return next(error);
        }
    };

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info(" Starting Login In");
            const authService = new AuthService();
            const responseObj = new ReponseMessage();
            const dataIn = await authService.login(req.body);
            logger.debug(dataIn);
            if (dataIn) {
                responseObj.message = dataIn;
                BaseController.createResponse.success(res, responseObj);
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info(" Starting Verifying Otp In");
            const authService = new AuthService();
            const responseObj = new ReponseMessage();
            const dataIn = await authService.verifyPhoneOtp(req.body);
            logger.debug(dataIn);
            if (dataIn) {
                responseObj.message="Verified Otp Successfully";
                responseObj.data = dataIn;
                BaseController.createResponse.success(res, responseObj);
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
}

