import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());//чтобы работали с куки
  app.enableCors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });//чтобы запросы клиент и сервере хорошо работали 

  await app.listen(5000);
}
bootstrap();
