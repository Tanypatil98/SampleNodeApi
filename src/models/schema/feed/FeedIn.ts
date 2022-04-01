import * as mongoose from 'mongoose';
import {IFeed} from '../../interface/IFeed';

const feedbackSchema = new mongoose.Schema({
    uid:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobileNumber:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required: true,
    },
    
},
{ timestamps: true });

const Feedback = mongoose.model<IFeed & mongoose.Document>('Feedback', feedbackSchema);
export default Feedback;