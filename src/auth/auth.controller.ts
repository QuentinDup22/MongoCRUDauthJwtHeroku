import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() LoginUserDto, @Res() res){
    // appler la methode de validation par password de authService
    const result = await this.authService.validateUserByPassword(LoginUserDto);
    if (result.success){ // si c'est bon on passe les données json
      return res.json(result.data);
    } else { // sinon on renvoie une entête HTTP UNAUTHRIZED
      return res.status(HttpStatus.UNAUTHORIZED).json({msg: result.msg});
    }  
  }
}
