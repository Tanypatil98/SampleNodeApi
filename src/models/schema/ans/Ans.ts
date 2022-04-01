import { IAns } from "../../interface/IAns";
import mongoose, { Document, Schema } from "mongoose";
import { ansCollection } from "../../../constants/CollectionConstants";

export const UserSchema = new Schema({
    userId: String,
    name: String,
    email: String,
    mobileNumber: String,
    videoId: String,
    answerId: String,
});

export type UserDocument = Document & IAns;

export const user = mongoose.model<UserDocument>(ansCollection, UserSchema);
