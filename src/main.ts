import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilters } from './filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    allowedHeaders: ['autorization'],
    method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionsSuccessStatus:200,
    origin: process.env.CORS_ORIGINS,
  }),

  app.useGlobalFilters(new AllExceptionsFilters())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }),
  );

  const config = new DocumentBuilder()
  .setTitle('example croud')
  .setDescription('The Example Croud api description')
  .setVersion('1.0')
  .addBearerAuth()
  .build()

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
    prefix: 'v'
  });

  const documentFactory = () => SwaggerModule.createDocument(app, config)

  if(process.env.NODE_ENV?.trim() == 'development') {
    SwaggerModule.setup('swg', app, documentFactory);
  }


  app.setGlobalPrefix('/api');

  const PORT = parseInt(process.env.APP_PORT as string) || 4000
  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}
bootstrap();
