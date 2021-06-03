import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from 'mongoose'
import { User } from "src/users/schemas/user.schema";

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post extends Document{
    @Prop({required: true})
    title: string;

    @Prop({required: true})
    text: string;

    @Prop()
    img: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User | string;
}
export const PostSchema = SchemaFactory.createForClass(Post);