import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '@src/app.module';
import { env } from './+env/server';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .setTitle('TRANSCENDENCE')
    .setDescription('The Transcendence API description')
    .setVersion('1.0')
    .addTag('transcendence')
    .addBearerAuth()
    .setExternalDoc('Download api collection', '/api-json')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: env.FRONTEND_URL,
    credentials: true,
    exposedHeaders: ['WWW-Authenticate'],
  });
  app.use(cookieParser());
  await app.listen(env.PORT ?? 8080);
}
bootstrap();
