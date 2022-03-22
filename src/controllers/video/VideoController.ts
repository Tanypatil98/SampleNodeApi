import BaseController from "../../core/utility/BaseController";
import ReponseMessage from "../../core/utility/ReponseMessage";
import logger from "../../core/Logger";
import { VideoService } from "../../services/video/VideoService";
import { Request, Response, NextFunction } from "express";
const responseObj = new ReponseMessage();
const videoService = new VideoService();

export default class AuthController extends BaseController {

    async getVideos(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Started Execution for findVideos ==>");
            const videos = await videoService.getVideos(req);
            res.setHeader('x-total-count', videos.length);
            responseObj.httpStatusCode = 200;
            responseObj.data = videos;
            BaseController.createResponse.success(res, responseObj);
        } catch (error) {
            logger.error(
                `Error in find Videos ${error}`
            );
            return next(error);
        }
    };
    async video(req: Request, res: Response, next: NextFunction) {

        try {
            logger.info("Started Execution for adding Video ==>");
            await videoService.addVideo(req);
            responseObj.httpStatusCode = 200;
            responseObj.message = "Video Created Succesfully.";
            BaseController.createResponse.success(res, responseObj);
        } catch (error) {
            logger.error(
                `Error in Adding Video ${error}`
            );
            return next(error);
        }

    };

    async videoAns(req: Request, res: Response, next: NextFunction) {

        try {
            logger.info("Started Execution for adding Video Anser ==>");
            await videoService.videoAns(req);
            responseObj.httpStatusCode = 200;
            responseObj.message = "Video Answer Submited Succesfully.";
            responseObj.data = [];
            BaseController.createResponse.success(res, responseObj);
        } catch (error) {
            logger.error(
                `Error in Adding Video ${error}`
            );
            return next(error);
        }

    };

    async getVideoById(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Started Execution for findVideoById ==>");
            responseObj.httpStatusCode = 200;
            responseObj.data = await videoService.findVideoById(req.params.vid);
            BaseController.createResponse.success(res, responseObj);
        } catch (error) {
            logger.error(
                `Error in find Video ${error}`
            );
            return next(error);
        }
    };
    async updateVideoById(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Started Execution for updateVideoById ==>");
            logger.info(req.params.uid);
            responseObj.httpStatusCode = 200;
            responseObj.message = await videoService.updateVideoById(req.params.vid, req);
            BaseController.createResponse.success(res, responseObj);
        } catch (error) {
            logger.error(
                `Error in update Video ${error}`
            );
            return next(error);
        }

    };
    async deleteVideoById(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Started Execution for deleteVideoById ==>");
            responseObj.httpStatusCode = 200;
            responseObj.message = await videoService.deleteVideoById(req.params.vid);
            BaseController.createResponse.success(res, responseObj);
        } catch (error) {
            logger.error(
                `Error in delete Video ${error}`
            );
            return next(error);
        }
    };
}

