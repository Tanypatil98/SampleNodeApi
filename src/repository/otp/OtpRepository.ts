import Otp from "../../models/schema/otp/Otp";


export class OtpRepository {

    async findOtp(condition: any) {
        return await Otp.findOne(condition);
    }

    async deleteOtp(condition: any) {
        return await Otp.deleteOne(condition);
    }


}




