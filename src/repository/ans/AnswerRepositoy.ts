import  Ans  from "../../models/schema/ans/AnsIn";

export class AnsRepository {

    async findAns(condition: any) {
        return await Ans.findOne(condition);
    }

    async findVideoUser(condition: any) {
        return await Ans.find(condition);
    }

    async findVideosWinnerList(condition: any) {
        return await Ans.find(condition).sort({ createdAt: 'asc'});
    }

    async deleteAns(condition: any) {
        return await Ans.deleteOne(condition);
    }

}