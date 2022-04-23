import { IFeed } from "../../interface/IFeed";
import mongoose, { Document, Schema } from "mongoose";
import { feedbackCollection } from "../../../constants/CollectionConstants";

export const FeedbackSchema = new Schema({
    uid: String,
    name: String,
    email: String,
    mobileNumber: String,
    message: String,
});

export type UserDocument = Document & IFeed;

export const user = mongoose.model<UserDocument>(feedbackCollection, FeedbackSchema);
