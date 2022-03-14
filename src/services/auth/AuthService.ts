import { AuthRepository } from "../../repository/auth/AuthRepository";
import { OtpRepository } from "../../repository/otp/OtpRepository";
import AppError from "../../core/utility/AppError";
import logger from "../../core/Logger";
const bcrypt = require('bcryptjs');
import User from "../../models/schema/user/UserAuth";
import Role from "../../models/schema/role/Role";
import Otp from "../../models/schema/otp/Otp";
import ReponseMessage from "../../core/utility/ReponseMessage";
const generateOTP = require("../../core/utility/Otpgeneration");
import jwt from "jsonwebtoken";
const responseObj = new ReponseMessage();
const authRepo = new AuthRepository();

export class AuthService {

    async signIn(req: any) {
        try {
            const responseObj = new ReponseMessage();
            const authRepo = new AuthRepository();
            const { email, password } = req;
            let identifiedUser;
            try {
                identifiedUser = await authRepo.findUser({ email: email });
            }
            catch (err) {
                responseObj.httpStatusCode = 401;
                responseObj.message = "something went wrong.login failed.";

                throw new AppError(responseObj.message);
            }


            if (!identifiedUser) {
                responseObj.httpStatusCode = 401;
                responseObj.message = "User is not registered or enter wrong email,or sign up first.";

                throw new AppError(responseObj.message);
            }

            let isValidPassword;
            try {
                isValidPassword = await bcrypt.compare(password, identifiedUser.password);
            } catch (err) {
                responseObj.httpStatusCode = 500;
                responseObj.message = "Password do not Match.";

                throw new AppError(responseObj.message);
            }


            //console.log(identifiedUser.email);
            if (!isValidPassword) {
                responseObj.httpStatusCode = 401;
                responseObj.message = "Password do not Match.";

                throw new AppError(responseObj.message);
            }
            let token;
            try {
                token = jwt.sign({ userId: identifiedUser.id, email: identifiedUser.email },
                    process.env.JWT_KEY,
                    { expiresIn: '1h' });
            } catch (err) {
                responseObj.httpStatusCode = 500;
                responseObj.message = err;

                throw new AppError(responseObj.message);
            }
            const res = { userId: identifiedUser.id, email: identifiedUser.email, token: token };
            return res;
        } catch (error) {
            logger.error(`Error in login method of AuthService ${error}`);
            throw error;
        }
    }

    async login(req: any) {
        try {

            const { mobileNumber } = req;
            let identifiedUser;
            try {
                identifiedUser = await authRepo.findUser({ mobileNumber: mobileNumber });
            }
            catch (err) {
                responseObj.httpStatusCode = 401;
                responseObj.message = "something went wrong.login failed.";

                throw new AppError(responseObj.message);
            }


            if (!identifiedUser) {
                responseObj.httpStatusCode = 401;
                responseObj.message = "User is not registered or enter wrong number,or sign up first.";

                throw new AppError(responseObj.message);
            }

            const otp = generateOTP(6);
            const createdOtp = new Otp({
                otp,
                mobileNumber,
            });

            try {
                await createdOtp.save();
            } catch (err) {
                responseObj.httpStatusCode = 401;
                responseObj.message = "something went wrong.login failed.";

                throw new AppError(responseObj.message);
            }


            const res = "Otp Send on registered number. Otp: " + otp;
            return res;
        } catch (error) {
            logger.error(`Error in login method of AuthService ${error}`);
            throw error;
        }
    }

    async verifyPhoneOtp(req: any) {
        try {
            const otpRepo = new OtpRepository();
            const { otp } = req;
            const otpData = await otpRepo.findOtp({ otp: otp });
            if (!otpData) {
                responseObj.httpStatusCode = 400;
                responseObj.message = "something went wrong.otp failed.";

                throw new AppError(responseObj.message);
            }
            if (otpData.isDeleted === true) {
                responseObj.httpStatusCode = 400;
                responseObj.message = "Wrong Otp";

                throw new AppError(responseObj.message);
            }
            let identifiedUser;
            try {
                identifiedUser = await authRepo.findUserById({ mobileNumber: otpData.mobileNumber });
            }
            catch (err) {
                responseObj.httpStatusCode = 401;
                responseObj.message = "something went wrong.login failed.";

                throw new AppError(responseObj.message);
            }
            // let token;
            // try {
            //     token = jwt.sign({ userId: identifiedUser.id, email: identifiedUser.email },
            //         process.env.JWT_KEY,
            //         { expiresIn: '24h' });
            // } catch (err) {
            //     responseObj.httpStatusCode = 500;
            //     responseObj.message = err;

            //     throw new AppError(responseObj.message);
            // }
            try {
                otpData.isDeleted = true;
                otpData.save();
            }
            catch (err) {
                responseObj.httpStatusCode = 401;
                responseObj.message = "something went wrong.delete otp failed.";

                throw new AppError(responseObj.message);
            }
            return identifiedUser;
        } catch (error) {
            throw new AppError(error);
        }
    };

    async registerAdmin(user: any) {
        try {
            logger.info("Started Execution for registerUser ==>");
            const { name, email, mobileNumber, password } = user;
            const responseObj = new ReponseMessage();
            const authRepo = new AuthRepository();
            let existingUser;
            try {
                const condition = { email: email }
                existingUser = await authRepo.findUser(condition);
            }
            catch (err) {
                logger.error("messerr");
                throw err;
            }
            if (existingUser) {
                logger.error('User Exist.');
                responseObj.httpStatusCode = 401;
                responseObj.message = "User Email Alredy Exist";

                throw new AppError(responseObj.message);
            }
            let existingUserNumber;
            try {
                const condition = { mobileNumber: mobileNumber }
                existingUserNumber = await authRepo.findUser(condition);
            }
            catch (err) {
                logger.error("messerr");
                throw err;
            }
            if (existingUserNumber) {
                logger.error('User Exist.');
                responseObj.httpStatusCode = 401;
                responseObj.message = "User Phone Number Alredy Exist";

                throw new AppError(responseObj.message);
            }
            try {
                await this.checkPassword(password);
            } catch (err) {
                throw new AppError("Password min length 8, must include Special Character, number");
            }
            let hashedPassword;
            try {
                hashedPassword = await bcrypt.hash(password, 12);
            } catch (err) {
                responseObj.httpStatusCode = 500;
                responseObj.message = "Could not create user,please try again.";

                throw new AppError(responseObj.message);
            }
            const createdUser = new User({
                name,
                email,
                mobileNumber,
                password: hashedPassword,
            });

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
            let token;
            try {
                token = jwt.sign({ userId: createdUser.id, email: createdUser.email },
                    process.env.JWT_KEY,
                    { expiresIn: '24h' });
            } catch (err) {
                responseObj.httpStatusCode = 500;
                responseObj.message = "singn up Failed.plese try again";

                throw new AppError(responseObj.message);
            }
            const res = { user:{id:createdUser.id, name: createdUser.name, email: createdUser.email, mobileNumber: createdUser.mobileNumber},token:token };
            return res;
        } catch (error) {
            logger.error(
                `Error in registerUser method of AuthService ${error}`
            );
            throw error;
        }
    }

    async findUserById(userId: any) {
        try {
            logger.info("Started Execution for findUserById ==>");
            const authRepo = new AuthRepository();
            return await authRepo.findUserById({ _id: userId });
        } catch (error) {
            logger.error(
                `Error in findUserById method of AuthService ${error}`
            );
            throw error;
        }
    }

    async forgotPassword(user: any) {
        try {
            logger.info("Started Execution for Forgot Password ==>");
            const { mobileNumber, password } = user;
            const responseObj = new ReponseMessage();
            const authRepo = new AuthRepository();
            let existingUser;
            try {
                const condition = { mobileNumber: mobileNumber }
                existingUser = await authRepo.findUser(condition);
            }
            catch (err) {
                logger.error("messerr");
                throw err;
            }
            if (!existingUser) {
                logger.error('User not Exist.');
                responseObj.httpStatusCode = 401;
                responseObj.message = "Plaese Register User.";

                throw new AppError(responseObj.message);
            }
            let response =await this.updateUserById(existingUser._id, {newPassword: password});
            return "Password Successfully Updated.";
        } catch (error) {
            logger.error(
                `Error in findUserById method of AuthService ${error}`
            );
            throw error;
        }
    }

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
            const { name, email, mobileNumber, newPassword } = user;
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
            let hashedPassword;
            if (newPassword) {
                try {
                    hashedPassword = await bcrypt.hash(newPassword, 12);
                } catch (err) {
                    responseObj.httpStatusCode = 500;
                    responseObj.message = "Could not update user password,please try again.";

                    throw new AppError(responseObj.message);
                }
            }
            
            try {
                if(name) userById.name = name;
                if(email) userById.email = email;
                if(mobileNumber) userById.mobileNumber = mobileNumber;
                if(newPassword){
                    userById.password = hashedPassword;
                }
                if(user.file){
                    userById.image = user.file.path;
                }
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
            const res = "User Updated Successfuly";
            return res;
        } catch (error) {
            logger.error(
                `Error in findUserById method of AuthService ${error}`
            );
            throw error;
        }
    }

    checkPassword(str: any) {
        const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(str);
    }


}
