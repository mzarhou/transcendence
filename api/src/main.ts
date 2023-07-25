import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { env } from './env/server';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: env.FRONTEND_URL,
    credentials: true,
    exposedHeaders: ['WWW-Authenticate'],
  });
  app.use(cookieParser());
  await app.listen(env.PORT ?? 8080);
}
bootstrap();
