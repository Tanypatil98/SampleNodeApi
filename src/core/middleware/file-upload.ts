import logger from "../Logger";
import  multer from 'multer';
import path from "path";

const {v1:uuidv1} = require('uuid');

const MIME_TYPE_MAP: any = {
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpeg'
};

const fileUpload = multer({
    limits:{fileSize: 2000000},
    storage:multer.diskStorage({
        destination:(req,file,cb) => {
            cb(null,path.join(__dirname,'../../../src/uploads/images'));
        },
        filename:(req,file,cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            logger.info(ext);
            cb(null,uuidv1() + '.' + ext);
        }
    }),
    fileFilter:(req,file,cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error: any = isValid ? null : new Error('Invalid mime type!');
        logger.info(error);
        cb(error,isValid);
    }
});

module.exports = fileUpload;