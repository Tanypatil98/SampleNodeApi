import { AuthRepository } from "../../repository/auth/AuthRepository";
import { FeedRepository } from "../../repository/feed/FeedRepository";
import AppError from "../../core/utility/AppError";
import logger from "../../core/Logger";
import Feed from "../../models/schema/feed/FeedIn";
import ReponseMessage from "../../core/utility/ReponseMessage";
const responseObj = new ReponseMessage();
const authRepo = new AuthRepository();
const feedRepo = new FeedRepository();

export class FeedService {

    async addFeedback(req: any) {
        try {
            logger.info("Started Execution for addFeedback ==>");
            const { message } = req.body;
            let existingUser;
            try {
                const condition = { _id: req.user._id }
                existingUser = await authRepo.findUser(condition);
            }
            catch (err) {
                logger.error("messerr");
                throw err;
            }
            if (!existingUser) {
                logger.error('User Not Register');
                responseObj.httpStatusCode = 401;
                responseObj.message = "User Not Register";

                throw new AppError(responseObj.message);
            }
            let createdFeedback = new Feed({
                uid: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                mobileNumber: existingUser.mobileNumber,
                message: message,
            });
            try {
                createdFeedback.save((err: any, user: any) => {
                    if (err) {
                        throw new AppError(err);
                    }
                });

            }
            catch (err) {
                logger.error("err1");
                throw new AppError(err);
            }
            return "Feedback Successfully Added.";
        } catch (error) {
            logger.error(
                `Error in registerUser method of AuthService ${error}`
            );
            throw error;
        }
    }

    async getFeedbacks(req: any) {
        try {
            logger.info("Started Execution for findFeedbacks ==>");
            return await feedRepo.findFeedbacks();
        } catch (error) {
            logger.error(
                `Error in findFeedbacks method of FeedService ${error}`
            );
            throw error;
        }
    }

}
