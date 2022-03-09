import * as mongoose from 'mongoose';
import {IUser} from '../../interface/IUser';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobileNumber:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        minlength:6
    },
    
},
{ timestamps: true });

const User = mongoose.model<IUser & mongoose.Document>('User', userSchema);
export default User;