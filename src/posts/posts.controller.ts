import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, Res, NotFoundException, HttpStatus } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  
  @UseGuards(AuthGuard())
  @Post()
  create(@Body() createPostDto: CreatePostDto,@Req() request) {
    createPostDto.author = request.user._id;
    return this.postsService.create(createPostDto);
  }
  
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @UseGuards(AuthGuard())
  @Post(':id/img')
  @UseInterceptors(FileInterceptor('img',{
    storage: diskStorage({
      destination: './photos',
      filename: (req,file,cb) => {
        const newName = 'pic-'+Date.now();
        const ext = extname(file.originalname);
        cb(null,newName+ext);
      }
    })
  }))
  async uploadFile(@Param('id') postId, @UploadedFile() file, @Req() req, @Res() res){
    // http://localhost:3000/posts/photos/pic-12334555665.jpg
    // const urlImg = req.protocol + '://' + req.get('host') + '/posts/' + file.path;
    // photos/pic-12334555665.jpg
    const urlImg = 'photos/' + file.filename;
    const postUpdate = await this.postsService.update(postId,{img: urlImg});
    if (!postUpdate) throw new NotFoundException('This post does not exits');
    return res.status(HttpStatus.OK).json(postUpdate);
  }

  @Get('photos/:fileName')
  getFile(@Param('fileName') file, @Res() response){
    response.sendFile(file, {root: 'photos'});
  }
}
