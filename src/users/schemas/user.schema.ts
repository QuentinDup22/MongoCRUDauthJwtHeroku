import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as bcrypt from "bcrypt";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document{
    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true, select: false})
    password: string;

    @Prop()
    username: string;
    
    @Prop()
    avatar: string;

    validatePassword: Function;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save',function(next: Function){
    const user = this;
    if (user.password){
        bcrypt.genSalt(10,function(err,salt){
            if (err) return next(err);
            bcrypt.hash(user.password, salt, (err,hash)=>{
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    }
});

UserSchema.methods.validatePassword = function(candidatePassword,cb){
    const user = this;
    bcrypt.compare(candidatePassword, user.password, function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch);
    })
}