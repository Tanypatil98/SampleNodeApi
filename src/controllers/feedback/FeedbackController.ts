import BaseController from "../../core/utility/BaseController";
import ReponseMessage from "../../core/utility/ReponseMessage";
import logger from "../../core/Logger";
import { FeedService } from "../../services/feed/FeedService";
import { Request, Response, NextFunction } from "express";
const responseObj = new ReponseMessage();
const feedService = new FeedService();

export default class FeedbackController extends BaseController {
    async getFeedbacks(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Started Execution for findFeedbacks ==>");
            responseObj.httpStatusCode = 200;
            responseObj.message = "Feedbacks Successfully.";
            responseObj.data = await feedService.getFeedbacks(req);
            BaseController.createResponse.success(res, responseObj);
        } catch (error) {
            logger.error(
                `Error in find Feedbacks ${error}`
            );
            return next(error);
        }
    };

    async addFeedback(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Started Execution for ADD Feedback ==>");
            responseObj.httpStatusCode = 200;
            responseObj.message = await feedService.addFeedback(req);
            BaseController.createResponse.success(res, responseObj);
        } catch (error) {
            logger.error(
                `Error in adding Feedback ${error}`
            );
            return next(error);
        }


    };
}

