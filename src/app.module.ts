import { Module } from '@nestjs/common';
import * as path from "path"
import { ConfigModule } from "@nestjs/config"
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductModule, UserModule } from './modules';
import { APP_GUARD } from '@nestjs/core';
import { CheckAuthGuard } from './guards/check.auth.guard';
import { CheckRoleGuard } from './guards/check.role.guard';
import { JwtHelper } from './helpers';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV?.trim() === 'test'? '.env.test' : '.env',
      isGlobal: true
    }),

    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      sync: {
        alter: true
      },
      autoLoadModels: true
    }),

    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    UserModule,
    ProductModule,
    
  ],

    providers: [
    {
      provide: APP_GUARD,
      useClass: CheckAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: CheckRoleGuard
    },
    JwtHelper,
  ]
})
export class AppModule {}
