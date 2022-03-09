import _ from "lodash";
import { config as sharedConfig } from "./Shared";
import AppError from "../core/utility/AppError";
import Logger from "../core/Logger";


const configFactory = (() => {
    let appConfig;
    const envVariable: string = process.env.NODE_ENV || " ";
    console.log(envVariable);
    (envVariable);
    const env = _.startCase(_.camelCase(envVariable)).replace(/ /g, "");
    try {
        try {
            appConfig = require(`./${env}`).default;
        } catch (error) {
            throw new AppError(`${env} - Config file not found....`)
        }

        const config = _.merge(sharedConfig, appConfig);
        return Object.freeze(config);
    } catch (err) {
        throw err;
    }
})();

export default configFactory;