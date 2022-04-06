import * as mongoose from 'mongoose';
import {IUser} from '../../interface/IUser';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true
    },
    mobileNumber:{
        type:String,
        required:true,
    },
    referral_id:{
        type:String,
    },
    referrer:{
        type:String,
    },
    
},
{ timestamps: true });

const User = mongoose.model<IUser & mongoose.Document>('User', userSchema);
export default User;