import  User  from "../../models/schema/user/UserAuth";

export class AuthRepository {

    async findUser(condition: any) {
        return await User.findOne(condition);
    }

    async findUserById(condition: any) {
        return await User.findOne(condition, '-password');
    }

    async deleteUser(condition: any) {
        return await User.deleteOne(condition);
    }

}




