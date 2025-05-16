import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductCreateDto } from "./dtos";
import { ApiBody, ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('product')
export class ProductController{
  constructor(private readonly service: ProductService) {}

  @Get()
  @ApiOperation({summary: 'get all product'})
  async getAll() {
    return await this.service.getAll()
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(@UploadedFile() image: Express.Multer.File  ,@Body() body: ProductCreateDto) {
    return await this.service.create(body, image)
  }
}