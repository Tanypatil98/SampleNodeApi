import { VideoRepository } from "../../repository/video/VideoRepository";
import AppError from "../../core/utility/AppError";
import logger from "../../core/Logger";
import Video from "../../models/schema/video/Video";
import ReponseMessage from "../../core/utility/ReponseMessage";
const responseObj = new ReponseMessage();
const videoRpo = new VideoRepository();

export class VideoService {
    async addVideo (req: any) {
        const { title,description,videoUrl } = req.body;
        let existingVideo;
        try {
            existingVideo = await videoRpo.findVideo({ title: title });
        }
        catch (err) {
            logger.error("messerr");
            throw err;
        }
        if (existingVideo) {
            logger.error('Video Exist.');
            responseObj.httpStatusCode = 401;
            responseObj.message = "Video Exist";

            throw new AppError(responseObj.message);
        }
        const createdVideo = new Video({
            title,
            description,
            image:req.file.path,
            videoUrl
        });
        
        try {
            
           return await createdVideo.save();
        
        }
        catch(err){
            logger.error(err);
            responseObj.httpStatusCode = 500;
            responseObj.message = "Creating Video failed.Please try again.";
            throw new AppError(responseObj.message);
        }
    }

    async getVideos (req: any) {
        try {
            logger.info("Started Execution for findVideos ==>");
            var perPage = 10
            , page = Math.max(0, req.start);
            return await videoRpo.findVideos(perPage, page);
        } catch (error) {
            logger.error(
                `Error in findVideos method of VideoService ${error}`
            );
            throw error;
        }
    }

    async findVideoById(videoId: any) {
        try {
            logger.info("Started Execution for findVideoById ==>");
            return await videoRpo.findVideo({ _id: videoId });
        } catch (error) {
            logger.error(
                `Error in findVideoById method of VideoService ${error}`
            );
            throw error;
        }
    }

    async updateVideoById(videoId: any,req: any) {
        const { title, description, videoUrl } = req.body;
        
        let videoById: any;
        try {
            videoById = await videoRpo.findVideo({ _id: videoId });
        } catch (err) {
            responseObj.httpStatusCode = 500;
            responseObj.message = "something went wrong.Could not find Video.";
            throw new AppError(responseObj.message);
        }
        if (!videoById) {
            responseObj.httpStatusCode = 404;
            responseObj.message = "could not find for updating Video.";
            throw new AppError(responseObj.message);
        }

        try {
            if(title) videoById.title = title;
            if(description) videoById.description = description;
            if(videoUrl) videoById.videoUrl = videoUrl;
            if(req.file){
                videoById.image = req.file.path;
            }
            await videoById.save();
            const res = "Video was updated successfully!";
            return res;
        }
        catch (err) {
            responseObj.httpStatusCode = 500;
            responseObj.message = "something went wrong.Could not Update Video.";
            throw new AppError(responseObj.message);
        }

    }

    async deleteVideoById(videoId: any) {
        try {
            logger.info("Started Execution for deleteVideoById ==>");
            await videoRpo.deleteVideo({ _id: videoId });
            return "Video Deleted Successfully."
        } catch (error) {
            logger.error(
                `Error in deleteVideoById method of ArtileService ${error}`
            );
            throw error;
        }
    }
}