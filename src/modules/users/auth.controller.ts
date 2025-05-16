import { Body, Controller, Get, Post, Version } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dtos";
import { ApiOperation } from "@nestjs/swagger";


@Controller()
export class AuthController{
  constructor(private readonly service: AuthService) {}

  @ApiOperation({summary: 'get all users'})
  @Get()
  @Version('1')
  async getAll(){
    return await this.service.getAllUser();
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.service.register(body)
  }

  @Post('login')
  async login(@Body() body: LoginDto){
    return await this.service.login(body)
  }
}