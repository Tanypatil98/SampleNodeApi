import { IVideo } from "../../interface/IVideo";
import mongoose, { Document, Schema } from "mongoose";
import { videoCollection } from "../../../constants/CollectionConstants";

export const VideoSchema = new Schema({
    title: String,
    description: String,
    image: String,
    videoUrl: String,
});

export type UserDocument = Document & IVideo;

export const user = mongoose.model<UserDocument>(videoCollection, VideoSchema);
