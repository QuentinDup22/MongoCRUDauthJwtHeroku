import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {

  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>){}

  create(createPostDto: CreatePostDto) {
    const newPost = new this.postModel(createPostDto);
    return newPost.save();
  }

  findAll() {
    return this.postModel.find().populate('author');
  }

  findOne(id: string) {
    return this.postModel.findById(id).populate('author');
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel.findByIdAndUpdate(id, updatePostDto, {new: true});
  }

  remove(id: string) {
    return this.postModel.findByIdAndRemove(id);
  }
}
