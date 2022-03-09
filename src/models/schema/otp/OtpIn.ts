import { IOtp } from "../../interface/IOtp";
import mongoose, { Document, Schema } from "mongoose";
import { otpCollection } from "../../../constants/CollectionConstants";

export const OtpSchema = new Schema({
    otp: Number,
    mobileNumber: String,
    isDeleted: Boolean,
    created_at: Date
});

export type OtpDocument = Document & IOtp;

export const user = mongoose.model<OtpDocument>(otpCollection, OtpSchema);
