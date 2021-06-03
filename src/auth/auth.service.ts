import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService){}

    async validateUserByPassword(loginUserDto: LoginUserDto): Promise<any>{
        const user = await this.usersService.findByEmail(loginUserDto.email);
        console.log('user',user);
        return new Promise((resolve)=>{
            if (!user){
                resolve({success: false, msg: 'User not found'});
            }
            user.validatePassword(loginUserDto.password, (err,isMatch)=>{
                if (isMatch){
                    resolve({success: true, data: this.createJwtPayload(user)});
                } else {
                    resolve({success: false, msg: 'Wrong user or password'});
                }
            });
        })
    }

    createJwtPayload(user: UserDocument){
        const payload: JwtPayload = {
            sub: user._id,
            email: user.email
        }

        const jwt = this.jwtService.sign(payload);
        return{
            exp: 3600,
            token: jwt
        }
    }

}
