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
                router.post("/",authorization(), checkRole("videos"),fileUpload.single('image'), controller.video);
                router.get("/:vid",authorization(), checkRole("videos"), controller.getVideoById);
                router.put("/:vid",authorization(), checkRole("videos"),fileUpload.single('image'), controller.updateVideoById);
                router.delete("/:vid",authorization(), checkRole("videos"), controller.deleteVideoById);
                return router;
        }
}