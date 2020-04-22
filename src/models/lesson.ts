import mongoose, { Schema, Document } from 'mongoose';
export interface ILessonDocument extends Document {
    order: number,//顺序
    title: string,//标题
    video: string,//视频
    poster: string, //海报
    url: string,//url地址
    price: string,//价格
    category: string,//分类
    _doc: ILessonDocument
}
const LessonSchema: Schema<ILessonDocument> = new Schema({
    order: Number,//顺序
    title: String,//标题
    video: String,//视频
    poster: String, //海报
    url: String,//url地址
    price: String,//价格
    category: String,//分类
}, { timestamps: true });

export const Lesson = mongoose.model<ILessonDocument>('Lesson', LessonSchema);
