import winston from "winston";
import config from "../config/Index";
class Logger {

    private log: boolean;
    private logger: winston.Logger;


    constructor() {
        this.log = config.log || true;  // Rnd
        this.logger = this.initLogger();
    }


    initLogger() {
        const _logger = winston.createLogger();
        _logger.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.colorize({ all: true })
            ),
        }));

        return _logger;
    }

    info(message: any) {
        if (this.log) this.logger.info(message);
    }

    warn(message: any) {
        if (this.log) this.logger.warn(message);
    }

    error(message: any) {
        if (this.log) this.logger.error(message);
    }

    debug(message: any) {
        if (this.log) this.logger.debug(message);
    }

}

export default new Logger();
