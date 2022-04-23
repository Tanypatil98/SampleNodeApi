import * as mongoose from 'mongoose';
import {IAns} from '../../interface/IAns';

const userSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
    },
    mobileNumber:{
        type:String,
        required:true,
    },
    videoId:{
        type:String,
        required:true,
    },
    answerId:{
        type:String,
        required:true,
    },
    
},
{ timestamps: true });

const User = mongoose.model<IAns & mongoose.Document>('Answer', userSchema);
export default User;