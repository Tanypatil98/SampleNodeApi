import Video from "../../models/schema/video/Video";


export class VideoRepository {

    async findVideo(condition: any) {
        return await Video.findOne(condition);
    }

    async findVideos(perPage: number, page:number) {
        return await Video.find({}).skip((page-1)* perPage).limit(perPage).sort({ createdAt: 'desc'});
    }

    async findVideosLength() {
        return await Video.find({}).sort({ createdAt: 'desc'});
    }

    async deleteVideo(condition: any) {
        return await Video.deleteOne(condition);
    }


}




