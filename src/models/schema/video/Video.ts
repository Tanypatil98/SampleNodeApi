import * as mongoose from 'mongoose';
import {IVideo} from '../../interface/IVideo';

const videoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type: String,
        required: true,
    },
    videoPoster:{
        type:String,
        required:true,
    },
    videoUrl:{
        type:String,
        required:true,
    },
    duration:{
        type:String,
        required:true,
    },
    isNewVideo:{
        type:Boolean,
        required:true,
    },
    answerSubmitted:{
        type:Boolean,
        required:true,
    },
    questions: {
        type: Array,
        required:true,
    }
},
{ timestamps: true });

const Video = mongoose.model<IVideo & mongoose.Document>('videos', videoSchema);
export default Video;