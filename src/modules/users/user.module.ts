import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from "./model";
import { JwtModule } from "@nestjs/jwt";
import { JwtHelper } from "src/helpers";


@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY || 'secretsxmlh',
      signOptions: {expiresIn: process.env.ACCESS_SECRET_TIME || '1h'}
    })
  ],

  exports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtHelper]
})
export class UserModule {}