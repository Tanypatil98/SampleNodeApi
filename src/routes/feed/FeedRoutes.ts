import { authorization } from "../../core/middleware/Authorization";
import express from "express";
import FeedbackController from "../../controllers/feedback/FeedbackController";

export class FeedRoutes {
        static configureRoutes() {
                const controller = new FeedbackController();
                const router = express.Router();
                router.post("/addFeedback",authorization(), controller.addFeedback);
                router.get("/getFeedbacks",authorization(), controller.getFeedbacks);
                return router;
        }
}