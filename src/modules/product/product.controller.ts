import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseInterceptors, Version } from "@nestjs/common";
import { ProductService } from "./product.service";
import { IdParamDto, ProductCreateDto, ProductPatchDto, ProductQueryDto, ProductUpdateDto } from "./dtos";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { checkFileMimitypePipe, checkFileSizePipe } from "src/pipes";
import { Protected, Roles } from "src/decaratores";
import { UserRole } from "../users";


@Controller('product')
export class ProductController{
  constructor(private readonly service: ProductService) {}

  @Get()
  @Version('1')
  @ApiBearerAuth()
  @Protected(false)
  @Roles([UserRole.ADMIN, UserRole.USER, UserRole.SUPPER_ADMIN])
  @ApiOperation({summary: 'get all product'})
  async getAll(@Query() query: ProductQueryDto) {
    return await this.service.getAll(query)
  }

  @Post()
  @Version('1')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRole.ADMIN, UserRole.SUPPER_ADMIN])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(@UploadedFile(
    new checkFileSizePipe(5 * 1024 * 1024 /* 5mb */ ), new checkFileMimitypePipe(['.jpg', '.png', '.avif']))
    image: Express.Multer.File  ,@Body() body: ProductCreateDto) {
    return await this.service.create(body, image)
  }


  @Put(':id')
  @Version('1')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRole.ADMIN, UserRole.SUPPER_ADMIN])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async update(@UploadedFile(
    new checkFileSizePipe(5 * 1024 * 1024 /* 5mb */ ), new checkFileMimitypePipe(['.jpg', '.png', '.avif'])
) image: Express.Multer.File,@Body() body: ProductUpdateDto, @Param('id') id: string){
    return await this.service.update(id, body, image)
  }

  @Patch(':id')
  @Version('1')
  @ApiBearerAuth()
  @Protected(true)
  @Roles([UserRole.ADMIN, UserRole.SUPPER_ADMIN])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async patch(@UploadedFile(
    new checkFileSizePipe(5 * 1024 * 1024 /* 5mb */ ), new checkFileMimitypePipe(['.jpg', '.png', '.avif']))
     image: Express.Multer.File,@Body() body: ProductPatchDto, @Param('id') id: string){
    return await this.service.updatePatch(id, body, image);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Version('1')
  @Protected(true)
  @Roles([UserRole.ADMIN, UserRole.SUPPER_ADMIN])
  async delete(@Param('id') id: string) {
    return await this.service.delete(id)
  }
}