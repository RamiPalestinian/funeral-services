import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });
  app.use(cookieParser());

  // подключили нашу валидацию на все наше серверное приложение
  app.useGlobalPipes(
    //процессы которые могут иметь несколько шагов(процесс валидации)
    new ValidationPipe({
      whitelist: true, // можно добавить blacklist и прописать запрещенные имена
      transform: true,
      forbidNonWhitelisted: true, // данные не прошедшие валидацию не пускаем дальше
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
