import {
  BadRequestException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './model';
import { IdefaultAdmin, Ilogin, Iregister } from './interface';
import * as bcrypt from 'bcryptjs';
import { JwtHelper } from 'src/helpers';
import { UserRole } from './enum';

export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
    private readonly jwt: JwtHelper,
  ) {}

  async onModuleInit() {
    await this.seedFile();
  }

  async getAllUser() {
    const {count, rows: users} = await this.userModel.findAndCountAll()

    return {
      message: 'success',
      count: count,
      data: users,
    }
  }

  async register(payload: Iregister) {
    const foundedUSer = await this.userModel.findOne({
      where: { email: payload.email },
    });
    if (foundedUSer) {
      throw new ConflictException('user already exists');
    }

    const hashPassword = await bcrypt.hash(payload.password, 10);

    const user = await this.userModel.create({
      name: payload.name,
      email: payload.email,
      password: hashPassword,
    });

    return {
      message: 'success',
      data: user,
    };
  }

  async login(payload: Ilogin) {
    const foundedUSer = await this.userModel.findOne({
      where: { email: payload.email },
    });

    if (!foundedUSer) {
      throw new BadRequestException('user not found');
    }

    const checkPass = await bcrypt.compare(
      payload.password,
      foundedUSer.password,
    );

    if (!checkPass) {
      throw new BadRequestException('Error Password');
    }

    const forToken = {
      id: foundedUSer.id,
      role: foundedUSer.role,
    };

    const token = await this.jwt.generateToken(forToken);

    return {
      message: 'success',
      token: token,
      data: foundedUSer,
    };
  }

  async seedFile() {
    try {
      const defaultAdmin: IdefaultAdmin[] = [
        {
          name: 'halil',
          email: 'halil@gmail.com',
          password: 'salom',
          role: UserRole.ADMIN,
        },
        {
          name: 'salim',
          email: 'salim@gmail.com',
          password: 'salom',
          role: UserRole.SUPPER_ADMIN,
        },
      ];

      defaultAdmin.forEach(async (user) => {

        const foundUser = await this.userModel.findOne({where: {email: user.email}})

        if(!foundUser){
          const newPass = await bcrypt.hash(user.password, 10);
           await this.userModel.create({
          name: user.name,
          email: user.email,
          password: newPass,
          role: user.role,
        });
        }
      });

      console.log('default adminlar yaratildi ✅');
    } catch (error) {
      console.log('default adminlarni  yaratishda xatolik ❌');
    }
  }
}
