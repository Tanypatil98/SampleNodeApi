import http from "http";
import dotenv from "dotenv";
dotenv.config();
import app from "./App";
import config from "./config/Index";
import dbConnection from "./core/DbConnection";
// import customerDbConnection from "./core/CustomerDbConnection";
import logger from "./core/Logger";

const PORT = process.env.PORT || "80";
const HOST = process.env.HOST || config.host;

const application = new app().init();
const server = http.createServer(application);


const listen = () => {
  server.listen(PORT,
    () => {
      logger.info(`${config.apiName} is running in IP: ${HOST}  PORT : ${PORT}`);
      logger.info(`Worker ${process.pid} started`);
    });
};


const stopServer = () => {
  logger.info("####### MongoDb Disconnected #######");
  server.close(() => {
    logger.warn(`${config.apiName}is Stopped in IP: ${HOST}  PORT : ${PORT}`);
  });
  //});
};

const startServer = () => {
  logger.info("#######Starting Db Server");
  /*** If Db connection SuccessFul then Start the Server Else Shutdown*/
  dbConnection.connect({
    connectionUri: config.mongo.connectionUri,
    configuraitons: config.mongo.options
  }).then(() => {
    logger.info(`####### Db connceted at ${config.mongo.connectionUri}`);

    listen();
  }).catch((err) => {
    logger.info("##Error");
    logger.error(err.message);
  });

};

export {
  startServer,
  stopServer
};
