import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // Todo: use env FRONTEND_URL
    origin: 'http://localhost:3001',
    credentials: true,
    exposedHeaders: ['WWW-Authenticate'],
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
