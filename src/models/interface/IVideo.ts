export interface IVideo {
    title: string;
    description: string;
    videoPoster: string;
    videoUrl: string;
    duration: string;
    isNewVideo: boolean;
    answerSubmitted: boolean;
    questions: Array<string>;
}