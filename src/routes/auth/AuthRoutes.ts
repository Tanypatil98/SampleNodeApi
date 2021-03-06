import { authorization } from "../../core/middleware/Authorization";
const checkRole = require("../../core/middleware/CheckRole");
import express from "express";
const fileUpload = require("../../core/middleware/file-upload");
import AuthController from "../../controllers/auth/AuthController";

export class AuthRoutes {
        static configureRoutes() {
                const controller = new AuthController();
                const router = express.Router();
                // router.post("/register", controller.registerAdmin);
                router.post("/sendOtp", controller.login);
                router.post("/verifyOtp", controller.verifyOtp);
                // router.post("/login", controller.signIn);
                // router.post("/forgot", controller.forgotPassword);
                router.put("/user/:uid", authorization(), controller.updateUserById);
                router.delete("/user/:uid", authorization(), controller.deleteUserById);
                router.get("/user/:uid", controller.getUserById);
                router.get("/getReferral/:uid",authorization(), controller.getReferral);
                return router;
        }
}