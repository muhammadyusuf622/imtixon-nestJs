import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductModel } from './model';
import { IproductCreate, ISeedFile } from './interface';
import { FsHelper } from 'src/helpers';
import { isUUID } from 'validator';
import { ProductPatchDto, ProductQueryDto } from './dtos';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Op } from 'sequelize';

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: typeof ProductModel,
    private readonly fsHelper: FsHelper,
  ) {}

  async onModuleInit() {
    await this.seedFile();
  }

  async getAll(query: ProductQueryDto) {
    let filters: any = {};

    if (query?.minPrice) {
      filters.price = {
        [Op.gte]: query.minPrice,
      };
    }

    if (query?.maxPrice) {
      filters.price = {
        ...filters.price,
        [Op.lte]: query.maxPrice,
      };
    }

    const offset = (query?.page - 1) * query?.limit;

    const { count, rows: data } = await this.productModel.findAndCountAll({
      order: [
        [
          query?.sortField || ('name' as string),
          query?.sortOrder || ('ASC' as string),
        ],
      ],
      where: { ...filters },
      attributes: query?.fields,
      limit: query?.limit || 10,
      offset: offset || 0,
    });

    return {
      message: 'success',
      count: count - offset,
      limit: query.limit || 10,
      page: query.page || 1,
      data: data || [],
    };
  }

  async create(payload: IproductCreate, image: Express.Multer.File) {
    const imageUrl = await this.fsHelper.uploadFile(image);

    const foundUser = await this.productModel.create({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      discount: payload.discount,
      rating: payload.rating,
      stock: payload.stock,
      image: imageUrl,
    });

    return {
      message: 'success',
      data: foundUser,
    };
  }

  async update(
    id: string,
    payload: IproductCreate,
    image: Express.Multer.File,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const foundedProduct = await this.productModel.findByPk(id);

    if (!foundedProduct) {
      throw new NotFoundException('Product Not Found');
    }

    const newImgUrl = await this.fsHelper.uploadFile(
      image,
      foundedProduct.dataValues.image,
    );

    const updateProduct = await this.productModel.update(
      {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        discount: payload.discount,
        rating: payload.rating,
        stock: payload.stock,
        status: payload.status,
        image: newImgUrl,
      },
      { where: { id }, returning: true },
    );

    return {
      message: 'success',
      data: updateProduct,
    };
  }

  async updatePatch(
    id: string,
    payload: ProductPatchDto,
    image: Express.Multer.File,
  ) {
    let imgUrl: string | undefined = undefined;

    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const foundedProduct = await this.productModel.findByPk(id);

    if (!foundedProduct) {
      throw new NotFoundException('Product Not Found');
    }

    if (image) {
      imgUrl = await this.fsHelper.uploadFile(
        image,
        foundedProduct.dataValues.image,
      );
    }

    const updateProduct = await this.productModel.update(
      {
        name: payload.name || foundedProduct.dataValues.name,
        description:
          payload.description || foundedProduct.dataValues.description,
        price: payload.price || foundedProduct.dataValues.price,
        discount: payload.discount || foundedProduct.dataValues.discount,
        rating: payload.rating || foundedProduct.dataValues.rating,
        stock: payload.stock || foundedProduct.dataValues.stock,
        image: imgUrl || foundedProduct.dataValues.image,
      },
      { where: { id }, returning: true },
    );

    return {
      message: 'success',
      data: updateProduct,
    };
  }

  async delete(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const foundedProduct = await this.productModel.findByPk(id);

    if (!foundedProduct) {
      throw new NotFoundException('Product Not Found');
    }

    await this.fsHelper.uploadFile(undefined, foundedProduct.dataValues.image);

    await this.productModel.destroy({ where: { id } });

    return {
      message: 'success',
    };
  }

  async seedFile() {
    try {
      const filePath = path.join(process.cwd(), 'product_data.json');

      const products = await fs.readFile(filePath, 'utf-8');

      const data = JSON.parse(products);

      data.forEach(async (product: ISeedFile) => {
        const foundProduct = await this.productModel.findOne({
          where: { name: product.name },
        });
        if (!foundProduct) {
          await this.productModel.create({
            name: product.name,
            description: product.description,
            price: product.price,
            discount: product.discount,
            rating: product['rating '],
            stock: product.stock,
            image: product.image,
          });
        }
      });

      console.log('default productlar yaratildi ✅');
    } catch (error) {
      console.log('default productlar yaratilishda xatolik ❌');
    }
  }
}
