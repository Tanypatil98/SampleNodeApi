import nodemailer, { SentMessageInfo } from "nodemailer";
import logger from "../Logger";
import config from "../../config/Index";
import handlebars from "handlebars";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export default class Mailer {
    private transporter: Mail;
    private options: SMTPTransport.Options;

    constructor() {
        this.options = config.mail.creds;
        this.transporter = nodemailer.createTransport(this.options);
    }

    

    connect = async (): Promise<boolean | Error> => {
        return new Promise((resolve, reject) => {
            this.transporter.verify((err: Error | null, success: true) => {
                (err) ? reject(err) : (logger.info("########## Smpt connection initialized ###########"));
            });
        });
    }

    parseEmailTemplate = (emailTemplate: any, body: any): string => {
        const template = handlebars.compile(emailTemplate);
        const htmlToSend = template(body);
        return htmlToSend;
    }

    disConnect = async (): Promise<boolean> => {
        this.transporter.close();
        return Promise.resolve(true);
    }

    sendEmail = async (mailOptions: Mail.Options): Promise<SentMessageInfo | Error> => {
        logger.info(`Sending email to user with id ${mailOptions.to}`);
        return new Promise(async (resolve, reject) => {
            this.transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
                (error) ? reject(error) : resolve(info);
            });
        });
    }


}
