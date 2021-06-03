import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req, Res, HttpStatus, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  
  @UseGuards(AuthGuard())
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(AuthGuard())
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar',{
    storage: diskStorage({
      destination: './avatar',
      filename: (req,file,cb) => {
        const newName = 'avatar-'+Date.now();
        const ext = extname(file.originalname);
        cb(null,newName+ext);
      }
    })
  }))
  async uploadFile(@Param('id') userId, @UploadedFile() file, @Req() req, @Res() res){
    // http://localhost:3000/users/avatar/pic-12334555665.jpg
    // const urlImg = req.protocol + '://' + req.get('host') + '/users/' + file.path;
    const urlImg = 'avatar/' + file.filename;
    const userUpdate = await this.usersService.update(userId,{avatar: urlImg});
    if (!userUpdate) throw new NotFoundException('This post does not exits');
    return res.status(HttpStatus.OK).json(userUpdate);
  }

  @Get('avatar/:fileName')
  getFile(@Param('fileName') file, @Res() response){
    response.sendFile(file, {root: 'avatar'});
  }
}
