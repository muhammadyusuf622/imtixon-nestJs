import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { ProductModel } from "./model";
import { JwtModule } from "@nestjs/jwt";
import { FsHelper } from "src/helpers";



@Module({
  imports: [
    SequelizeModule.forFeature([ProductModel]),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: {expiresIn: process.env.ACCESS_SECRET_TIME}
    })
  ],

  exports: [JwtModule],
  controllers: [ProductController],
  providers: [ProductService, FsHelper]
})


export class ProductModule {}