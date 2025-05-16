import { Body, Controller, Get, Post, Version } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dtos";
import { ApiOperation } from "@nestjs/swagger";
import { Protected, Roles } from "src/decaratores";
import { UserRole } from "./enum";


@Controller()
export class AuthController{
  constructor(private readonly service: AuthService) {}

  @ApiOperation({summary: 'get all users'})
  @Get()
  @Version('1')
  @Protected(false)
  @Roles([UserRole.ADMIN, UserRole.SUPPER_ADMIN, UserRole.USER])
  async getAll(){
  return await this.service.getAllUser();
  }

  @Post('register')
  @Version('1')
  @Protected(false)
  @Roles([UserRole.ADMIN, UserRole.SUPPER_ADMIN, UserRole.USER])
  async register(@Body() body: RegisterDto) {
    return this.service.register(body)
  }

  @Post('login')
  @Version('1')
  @Protected(false)
  @Roles([UserRole.ADMIN, UserRole.SUPPER_ADMIN, UserRole.USER])
  async login(@Body() body: LoginDto){
    return await this.service.login(body)
  }
}