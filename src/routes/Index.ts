import express from "express";
import { AuthRoutes } from "./auth/AuthRoutes";
import { VideoRoutes } from "./Video/Video";

export class RouteBinder {
    static bindRoutes() {
        const router = express.Router();
        // @** attach route guard i.e access restriction based on module level.
        router.use("/auth", AuthRoutes.configureRoutes());
        router.use("/video", VideoRoutes.configureRoutes());
        return router;
    }
}
