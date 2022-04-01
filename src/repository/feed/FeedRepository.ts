import  Feed  from "../../models/schema/feed/FeedIn";

export class FeedRepository {

    async findFeedbacks() {
        return await Feed.find({}).sort({ createdAt: 'desc'});
    }

}