import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { IjwtToken } from "src/modules";



@Injectable()
export class JwtHelper{
  constructor(private readonly jwt: JwtService) {}

  async generateToken(payload: IjwtToken) {

    console.log( payload)

    const token = await this.jwt.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: process.env.ACCESS_SECRET_TIME,
    });

    return token;
  }

  async verifyToken(token: string){
    try {
      console.log("tokenkeladjnacjandkcnajdcnkacn", token)
    const openToken = await this.jwt.verifyAsync(token)
    return openToken
    } catch (error) {
      
      if(error instanceof JsonWebTokenError){
        throw new BadRequestException('jwt token error format');
      }

      if(error instanceof TokenExpiredError){
        throw new ForbiddenException('token time out');
      }

      throw new InternalServerErrorException('server error');
    }
  }
}