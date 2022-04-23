import { IUser } from "../../interface/IUser";
import mongoose, { Document, Schema } from "mongoose";
import { userCollection } from "../../../constants/CollectionConstants";

export const UserSchema = new Schema({
    email: String,
    name: String,
    mobileNumber: String,
    referral_id: String,
    referrer: String,
});

export type UserDocument = Document & IUser;

export const user = mongoose.model<UserDocument>(userCollection, UserSchema);
