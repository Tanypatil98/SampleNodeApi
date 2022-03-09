import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import logger from "./core/Logger";
import { exceptionHandling } from "./core/middleware/ExceptionHandling";
import { resourceNotFound } from "./core/middleware/ResourcesNotFound";
import { RouteBinder } from "./routes/Index";
import config from "./config/Index";

declare global {
    namespace Express {
      interface Request {
        user: any
      }
    }
  }

export default class App {
    
   

    initRoutes(app: Application) {
        app.use('/api/v1', RouteBinder.bindRoutes());
        logger.info("########## Routes initialized ###########");
        logger.info(config.apiBaseUri);
    }

    initMiddleware(app: Application) {
        app.use(exceptionHandling);
        app.use(resourceNotFound);
        logger.info("########## Middleware initialized ###########");
    }

    initSecurity(app: Application) {
        logger.info(config.corsoptions);
        app.use(cors(config.corsoptions));
        logger.info("########## Security initialized ###########");
    }

    initExternalModules(app: Application) {
        app.use(morgan("dev"));
        app.use(cookieParser());
        logger.info("########## External Modules initialized ###########");
    }


    initGlobalVariable() {
        (global as any).isProduction = process.env.NODE_ENV; // @isProduction : global varible
        logger.info('########## Global Variables initialized ###########');
    }

    // initFileUpload(app: Application) {
    //     if (!fs.existsSync(config.filePath)) {
    //         fs.mkdirSync(config.filePath);
    //     }
    //     app.use(express.static(config.filePath));
    //     app.use(fileUpload({
    //         useTempFiles: false,
    //         tempFileDir: path.resolve(config.filePath)
    //     }));
    // }

    init(): Application {
        const app : Application = express();
        app.use(bodyParser.json());
        app.use((req,res,next) => {
            res.setHeader("Access-Control-Expose-Headers", "x-total-count");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,x-total-count, Accept,Authorization,Origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    //res.setHeader("Access-Control-Allow-Credentials", true);
    next();
})
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use('/uploads/images',express.static(path.join('uploads','images')));
        this.initExternalModules(app);
        // this.initFileUpload(app);
        this.initSecurity(app);
        this.initGlobalVariable();
        this.initRoutes(app);
        this.initMiddleware(app);
        app.disable("x-powered-by");
        return app;
    }


}
