import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(private configService: ConfigService,
        private usersService: UsersService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: (request, jwtToken, done)=>{
             done(null, configService.get('JWT_SECRET'));  
            }
        })
    }
    async validate(payload: JwtPayload){
        const user = await this.usersService.findOne(payload.sub);
        if (!user){
            throw new UnauthorizedException();
        }
        return user;
    }
}