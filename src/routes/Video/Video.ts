import express from "express";
import VideoController from "../../controllers/video/VideoController";
const fileUpload = require("../../core/middleware/file-upload");
import { authorization } from "../../core/middleware/Authorization";
const checkRole = require("../../core/middleware/CheckRole");

export class VideoRoutes {
        static configureRoutes() {
                const controller = new VideoController();
                const router = express.Router();
                router.post("/", controller.getVideos);
                router.post("/newVideo", authorization(), controller.video);
                router.post("/answer", authorization(), controller.videoAns);
                // router.get("/:vid",authorization(),  controller.getVideoById);
                // router.put("/:vid",authorization(), fileUpload.single('image'), controller.updateVideoById);
                // router.delete("/:vid",authorization(),  controller.deleteVideoById);
                return router;
        }
}