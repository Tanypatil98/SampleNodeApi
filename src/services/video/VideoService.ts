import { VideoRepository } from "../../repository/video/VideoRepository";
import AppError from "../../core/utility/AppError";
import logger from "../../core/Logger";
import Video from "../../models/schema/video/Video";
import ReponseMessage from "../../core/utility/ReponseMessage";
import { AnsRepository } from "../../repository/ans/AnswerRepositoy";
import  Ans  from "../../models/schema/ans/AnsIn";
import { AuthRepository } from "../../repository/auth/AuthRepository";
import { v4 as uuidv4 } from 'uuid';
const responseObj = new ReponseMessage();
const videoRpo = new VideoRepository();
const ansRpo = new AnsRepository();
const authRpo = new AuthRepository();

export class VideoService {
    async addVideo (req: any) {
        const { title,description,videoUrl, videoPoster,duration,question,answer,options } = req.body;
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
        let tempOptions = options.map((opt) => {
            return {
                id : uuidv4(),
                text: opt
            }
        });
        let questions = [{
            id: uuidv4(),
            questionTxt: question,
            answer: tempOptions.filter((opt) => opt.text === answer)[0].id,
            options: tempOptions
        }];
        const createdVideo = new Video({
            title,
            description,
            videoUrl,
            videoPoster,
            duration,
            answerSubmitted: false,
            questions,
            isNewVideo: true
        });
        
        try {
            
           await createdVideo.save();
           return true;
        
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
            , page = Math.max(0, req.body.start);
            let videos = await videoRpo.findVideos(perPage, page);
            // let videos = await videoRpo.findVideos();
            let existingAns,existingUser;
            try {
                const condition = { userId: req.body.userId}
                existingAns = await ansRpo.findVideoUser(condition);
                existingUser = await authRpo.findUserById({_id: req.body.userId});
            }
            catch (err) {
                logger.error("messerr");
                throw err;
            }
            logger.info(existingUser);
            if (existingAns) {
                videos?.map((objVideo) => {
                    existingAns?.map((obj) => {
                        if(obj.videoId === objVideo._id.toString()){
                            objVideo["answerSubmitted"] = true;
                        }
                        return true;
                    });
                    return true;
                });
            }
            return existingUser ? videos : [];
        } catch (error) {
            logger.error(
                `Error in findVideos method of VideoService ${error}`
            );
            throw error;
        }
    }

    async getWinnerList (req: any) {
        try {
            logger.info("Started Execution for findVideosWinnerList ==>");
            const { videoId } = req.body;
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
            let condition = { videoId: videoId, answerId: videoById.questions[0].answer}
            let videos = await ansRpo.findVideosWinnerList(condition);
            return videos ? videos : [];
        } catch (error) {
            logger.error(
                `Error in findVideosWinnerList method of VideoService ${error}`
            );
            throw error;
        }
    }

    async videoAns(req: any) {
        try {
            logger.info("Started Execution for videoAns ==>");
            const { videoId, answerId } = req.body;
            let existingAns;
            try {
                const condition = { userId: req.user._id, videoId: videoId }
                existingAns = await ansRpo.findAns(condition);
            }
            catch (err) {
                logger.error("messerr");
                throw err;
            }
            if (existingAns) {
                logger.error('Answer Exist.');
                responseObj.httpStatusCode = 401;
                responseObj.message = "Answer Alredy Exist";

                throw new AppError(responseObj.message);
            }
            let existingUser;
            try {
                const condition = { _id: req.user._id }
                existingUser = await authRpo.findUser(condition);
            }
            catch (err) {
                logger.error("messerr");
                throw err;
            }
            if (!existingUser) {
                logger.error('User not Exist.');
                responseObj.httpStatusCode = 401;
                responseObj.message = "Plaese Register User.";

                throw new AppError(responseObj.message);
            }
            const createdAns = new Ans({
                userId: req.user._id,
                name: existingUser.name,
                email: existingUser.email,
                mobileNumber: existingUser.mobileNumber,
                videoId: videoId,
                answerId: answerId,
            });
            try{
                createdAns.save((err: any, user: any) => {
                    if (err) {
                        throw new AppError(err);
                    }
                });
            } catch (error) {
                throw new AppError("Answer Adding failed");
            }
            return "Successfully Added";
        } catch (error) {
            logger.error(
                `Error in videoAns method of VideoService ${error}`
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