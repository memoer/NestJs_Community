import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { SharedInterceptor } from './_shared/shared.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // DTO에서 유효성 검사하지 않는 property들에 대해서는 없앤다.
      whitelist: true,
      // DTO에서 유효성 검사하지 않는 property를 넘길 경우 throw error
      // whitelist를 true로 하고 true해야 정상 작동
      forbidNonWhitelisted: true,
    }),
  );
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.useGlobalInterceptors(new SharedInterceptor());
  await app.listen(3000);
}
bootstrap();
