import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ProductModel } from "./model";
import { IproductCreate } from "./interface";
import { FsHelper } from "src/helpers";


@Injectable()
export class ProductService implements OnModuleInit{
  constructor(@InjectModel(ProductModel) private readonly productModel: typeof ProductModel,
     private readonly fsHelper: FsHelper) {}

  async onModuleInit() {
    
  }

  async getAll() {

    const data = await this.productModel.findAll()

    return {
      message: 'success',
      data: data
    }
  }

  async create(payload: IproductCreate, image: Express.Multer.File) {

    const imageUrl = await this.fsHelper.uploadFile(image)
    
    const foundUser = await this.productModel.create({name: payload.name,
       description: payload.description, price: payload.price, discount: payload.discount,
      rating: payload.rating, stock: payload.stock, image: imageUrl })

    return {
      message: 'success',
      data: foundUser
    }
  }
}