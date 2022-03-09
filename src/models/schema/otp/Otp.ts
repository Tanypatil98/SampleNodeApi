import * as mongoose from 'mongoose';
import {IOtp} from '../../interface/IOtp';

const otpSchema = new mongoose.Schema({
    otp:{
        type:Number,
        required:true,
    },
    mobileNumber:{
        type: String,
        required: true,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    },
    created_at:{
        type:Date,
        required:true,
        default: Date.now
    }
});

const Otp = mongoose.model<IOtp & mongoose.Document>('Otp', otpSchema);
export default Otp;