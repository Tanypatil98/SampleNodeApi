import express from "express";
import VideoController from "../../controllers/video/VideoController";
import { authorization } from "../../core/middleware/Authorization";

export class VideoRoutes {
        static configureRoutes() {
                const controller = new VideoController();
                const router = express.Router();
                router.post("/", controller.getVideos);
                router.post("/newVideo", authorization(), controller.video);
                router.post("/answer", authorization(), controller.videoAns);
                router.get("/getWinnerList",authorization(),  controller.getWinnerList);
                // router.put("/:vid",authorization(), fileUpload.single('image'), controller.updateVideoById);
                // router.delete("/:vid",authorization(),  controller.deleteVideoById);
                return router;
        }
}