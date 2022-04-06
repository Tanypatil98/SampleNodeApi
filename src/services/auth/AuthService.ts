import { AuthRepository } from "../../repository/auth/AuthRepository";
import AppError from "../../core/utility/AppError";
import logger from "../../core/Logger";
const bcrypt = require('bcryptjs');
import User from "../../models/schema/user/UserAuth";
import ReponseMessage from "../../core/utility/ReponseMessage";
import HttpRequest from "../../core/utility/HttpRequest";
import jwt from "jsonwebtoken";
const responseObj = new ReponseMessage();
const requestHttp = new HttpRequest(process.env.SMS_BASE_URL);
const authRepo = new AuthRepository();

export class AuthService {

    // async signIn(req: any) {
    //     try {
    //         const responseObj = new ReponseMessage();
    //         const authRepo = new AuthRepository();
    //         const { email, password } = req;
    //         let identifiedUser;
    //         try {
    //             identifiedUser = await authRepo.findUser({ email: email });
    //         }
    //         catch (err) {
    //             responseObj.httpStatusCode = 401;
    //             responseObj.message = "something went wrong.login failed.";

    //             throw new AppError(responseObj.message);
    //         }


    //         if (!identifiedUser) {
    //             responseObj.httpStatusCode = 401;
    //             responseObj.message = "User is not registered or enter wrong email,or sign up first.";

    //             throw new AppError(responseObj.message);
    //         }

    //         let isValidPassword;
    //         try {
    //             isValidPassword = await bcrypt.compare(password, identifiedUser.password);
    //         } catch (err) {
    //             responseObj.httpStatusCode = 500;
    //             responseObj.message = "Password do not Match.";

    //             throw new AppError(responseObj.message);
    //         }


    //         //console.log(identifiedUser.email);
    //         if (!isValidPassword) {
    //             responseObj.httpStatusCode = 401;
    //             responseObj.message = "Password do not Match.";

    //             throw new AppError(responseObj.message);
    //         }
    //         let token;
    //         try {
    //             token = jwt.sign({ userId: identifiedUser.id, email: identifiedUser.email },
    //                 process.env.JWT_KEY,
    //                 { expiresIn: '1h' });
    //         } catch (err) {
    //             responseObj.httpStatusCode = 500;
    //             responseObj.message = err;

    //             throw new AppError(responseObj.message);
    //         }
    //         const res = { _id: identifiedUser.id, email: identifiedUser.email,name : identifiedUser.name,referral_id: identifiedUser.referral_id, token: token };
    //         return res;
    //     } catch (error) {
    //         logger.error(`Error in login method of AuthService ${error}`);
    //         throw error;
    //     }
    // }

    async login(req: any) {
        try {

            const { name, mobileNumber, referral_id } = req;
            if(name){
                let identifiedUser;
                try {
                    identifiedUser = await authRepo.findUser({ mobileNumber: mobileNumber });
                }
                catch (err) {
                    responseObj.httpStatusCode = 401;
                    responseObj.message = "something went wrong.login failed.";

                    throw new AppError(responseObj.message);
                }


                if (identifiedUser) {
                    responseObj.httpStatusCode = 401;
                    responseObj.message = "User Already registered with this number.";

                    throw new AppError(responseObj.message);
                }

                let lengthUser;
                try {
                    lengthUser = await authRepo.findAllUser();
                }
                catch (err) {
                    logger.error("messerr");
                    throw err;
                }

                let createdUser;
                if(referral_id && /TRY/.test(referral_id)){
                    createdUser = new User({
                        name,
                        mobileNumber,
                        referral_id: `TRY0${lengthUser.length+1}`,
                        referrer: referral_id
                    });    
                }else  if(!referral_id){
                    createdUser = new User({
                        name,
                        mobileNumber,
                        referral_id: `TRY0${lengthUser.length+1}`
                    });
                }else{
                    responseObj.httpStatusCode = 401;
                    responseObj.message = "User referral id not Exist";

                    throw new AppError(responseObj.message);
                }
                try {
                    createdUser.save((err: any, user: any) => {
                        if (err) {
                            throw new AppError(err);
                        }
                    });

                }
                catch (err) {
                    logger.error("err1");
                    throw new AppError(err);
                }
            }
            let resultOtp;
            
            resultOtp =await requestHttp.create(`https://www.smsalert.co.in/api/mverify.json?apikey=${process.env.SMS_APIKEY}&sender=${process.env.SMS_SENDERID}&mobileno=${mobileNumber}&template=Your authentication OTP for Trykro app is [otp].`,{})
            if(resultOtp["status"] === "success"){
                const res = "Otp Send on registered number.";
                return res;
            }else if(resultOtp["status"] === "error"){
                responseObj.httpStatusCode = 401;
                responseObj.message = resultOtp["description"]["desc"];

                throw new AppError(responseObj.message);
            }
        } catch (error) {
            logger.error(`Error in login method of AuthService ${error}`);
            throw error;
        }
    }

    async verifyPhoneOtp(req: any) {
        try {
            const { otp, mobileNumber } = req;
            let identifiedUser;
            try {
                identifiedUser = await authRepo.findUserById({ mobileNumber: mobileNumber });
            }
            catch (err) {
                responseObj.httpStatusCode = 401;
                responseObj.message = "something went wrong.login failed.";

                throw new AppError(responseObj.message);
            }

            let resultVerifyOtp;
            
            resultVerifyOtp =await requestHttp.create(`https://www.smsalert.co.in/api/mverify.json?apikey=${process.env.SMS_APIKEY}&mobileno=${mobileNumber}&code=${otp}`, {});

            if(resultVerifyOtp["status"] === "success"){
                let token;
                try {
                    token = jwt.sign({ userId: identifiedUser.id },
                        process.env.JWT_KEY,
                        { expiresIn: '24h' });
                } catch (err) {
                    responseObj.httpStatusCode = 500;
                    responseObj.message = err;
    
                    throw new AppError(responseObj.message);
                }
                return {identifiedUser, token: token};
            }else if(resultVerifyOtp["status"] === "error"){
                responseObj.httpStatusCode = 401;
                responseObj.message = resultVerifyOtp["description"]["desc"];

                throw new AppError(responseObj.message);
            }
        } catch (error) {
            throw new AppError(error);
        }
    };

    // async registerAdmin(user: any) {
    //     try {
    //         logger.info("Started Execution for registerUser ==>");
    //         const { name, email, mobileNumber, password, referral_id } = user;
    //         const responseObj = new ReponseMessage();
    //         const authRepo = new AuthRepository();
    //         let existingUser;
    //         try {
    //             const condition = { email: email }
    //             existingUser = await authRepo.findUser(condition);
    //         }
    //         catch (err) {
    //             logger.error("messerr");
    //             throw err;
    //         }
    //         if (existingUser) {
    //             logger.error('User Exist.');
    //             responseObj.httpStatusCode = 401;
    //             responseObj.message = "User Email Alredy Exist";

    //             throw new AppError(responseObj.message);
    //         }
    //         let existingUserNumber;
    //         try {
    //             const condition = { mobileNumber: mobileNumber }
    //             existingUserNumber = await authRepo.findUser(condition);
    //         }
    //         catch (err) {
    //             logger.error("messerr");
    //             throw err;
    //         }
    //         if (existingUserNumber) {
    //             logger.error('User Exist.');
    //             responseObj.httpStatusCode = 401;
    //             responseObj.message = "User Phone Number Alredy Exist";

    //             throw new AppError(responseObj.message);
    //         }
    //         let lengthUser;
    //         try {
    //             lengthUser = await authRepo.findAllUser();
    //         }
    //         catch (err) {
    //             logger.error("messerr");
    //             throw err;
    //         }
    //         try {
    //             await this.checkPassword(password);
    //         } catch (err) {
    //             throw new AppError("Password min length 8, must include Special Character, number");
    //         }
    //         let hashedPassword;
    //         try {
    //             hashedPassword = await bcrypt.hash(password, 12);
    //         } catch (err) {
    //             responseObj.httpStatusCode = 500;
    //             responseObj.message = "Could not create user,please try again.";

    //             throw new AppError(responseObj.message);
    //         }
    //         let createdUser;
    //         if(referral_id && /TRY/.test(referral_id)){
    //             createdUser = new User({
    //                 name,
    //                 email,
    //                 mobileNumber,
    //                 password: hashedPassword,
    //                 referral_id: `TRY0${lengthUser.length+1}`,
    //                 referrer: referral_id
    //             });    
    //         }else  if(!referral_id){
    //         createdUser = new User({
    //             name,
    //             email,
    //             mobileNumber,
    //             password: hashedPassword,
    //             referral_id: `TRY0${lengthUser.length+1}`
    //         });
    //         }else{
    //             responseObj.httpStatusCode = 401;
    //             responseObj.message = "User referral id not Exist";

    //             throw new AppError(responseObj.message);
    //         }
    //         try {
    //             createdUser.save((err: any, user: any) => {
    //                 if (err) {
    //                     throw new AppError(err);
    //                 }
    //             });

    //         }
    //         catch (err) {
    //             logger.error("err1");
    //             throw new AppError(err);
    //         }
    //         let token;
    //         try {
    //             token = jwt.sign({ userId: createdUser.id, email: createdUser.email },
    //                 process.env.JWT_KEY,
    //                 { expiresIn: '24h' });
    //         } catch (err) {
    //             responseObj.httpStatusCode = 500;
    //             responseObj.message = "singn up Failed.plese try again";

    //             throw new AppError(responseObj.message);
    //         }
    //         const res = { user:{_id:createdUser.id, name: createdUser.name, email: createdUser.email, mobileNumber: createdUser.mobileNumber, referral_id: createdUser.referral_id},token:token };
    //         return res;
    //     } catch (error) {
    //         logger.error(
    //             `Error in registerUser method of AuthService ${error}`
    //         );
    //         throw error;
    //     }
    // }

    async findUserById(userId: any) {
        try {
            logger.info("Started Execution for findUserById ==>");
            const authRepo = new AuthRepository();
            let userIdDetails = await authRepo.findUserById({ _id: userId });
            let token;
            try {
                token = jwt.sign({ userId: userIdDetails._id },
                    process.env.JWT_KEY,
                    { expiresIn: '1h' });
            } catch (err) {
                responseObj.httpStatusCode = 500;
                responseObj.message = err;

                throw new AppError(responseObj.message);
            }
            return {userIdDetails:userIdDetails,token: token};
        } catch (error) {
            logger.error(
                `Error in findUserById method of AuthService ${error}`
            );
            throw error;
        }
    }

    async getReferral(userId: any) {
        try {
            logger.info("Started Execution for findReferral ==>");
            const authRepo = new AuthRepository();
            let userDetail = await authRepo.findUserById({ _id: userId });
            return await authRepo.findReferral({ referrer: userDetail.referral_id });
        } catch (error) {
            logger.error(
                `Error in findReferrald method of AuthService ${error}`
            );
            throw error;
        }
    }

    // async forgotPassword(user: any) {
    //     try {
    //         logger.info("Started Execution for Forgot Password ==>");
    //         const { mobileNumber, password } = user;
    //         const responseObj = new ReponseMessage();
    //         const authRepo = new AuthRepository();
    //         let existingUser;
    //         try {
    //             const condition = { mobileNumber: mobileNumber }
    //             existingUser = await authRepo.findUser(condition);
    //         }
    //         catch (err) {
    //             logger.error("messerr");
    //             throw err;
    //         }
    //         if (!existingUser) {
    //             logger.error('User not Exist.');
    //             responseObj.httpStatusCode = 401;
    //             responseObj.message = "Plaese Register User.";

    //             throw new AppError(responseObj.message);
    //         }
    //         let response =await this.updateUserById(existingUser._id, {newPassword: password});
    //         return "Password Successfully Updated.";
    //     } catch (error) {
    //         logger.error(
    //             `Error in findUserById method of AuthService ${error}`
    //         );
    //         throw error;
    //     }
    // }

    async deleteUserById(userId: any) {
        try {
            logger.info("Started Execution for findUserById ==>");
            const authRepo = new AuthRepository();
            return await authRepo.deleteUser({ _id: userId });
        } catch (error) {
            logger.error(
                `Error in findUserById method of AuthService ${error}`
            );
            throw error;
        }
    }

    async updateUserById(userId: any, user: any) {
        try {
            logger.info("Started Execution for updateUserById ==>");
            const { name, email, mobileNumber } = user;
            const responseObj = new ReponseMessage();
            const authRepo = new AuthRepository();
            let userById;
            try {
                userById = await authRepo.findUser({ _id: userId });
            } catch (err) {
                responseObj.httpStatusCode = 500;
                responseObj.message = "something went wrong.Could not find user.";
                throw new AppError(responseObj.message);
            }
            if (!userById) {
                responseObj.httpStatusCode = 404;
                responseObj.message = "could not find user for updating user.";
                throw new AppError(responseObj.message);
            }
            
            try {
                if(name) userById.name = name;
                if(email) userById.email = email;
                if(mobileNumber) userById.mobileNumber = mobileNumber;
                    try {
                        userById.save();
                    } catch (err) {
                        responseObj.httpStatusCode = 500;
                        responseObj.message = "something went wrong.Could not Update user.";
                        throw new AppError(responseObj.message);
                    }
            }
            catch (err) {
                logger.error("err1");
                throw new AppError(err);
            }
            const res = "User Profile Updated Successfully";
            return res;
        } catch (error) {
            logger.error(
                `Error in findUserById method of AuthService ${error}`
            );
            throw error;
        }
    }

    // checkPassword(str: any) {
    //     const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    //     return re.test(str);
    // }


}
