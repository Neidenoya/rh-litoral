import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3333;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`RH Litoral API em http://localhost:${port}/api/v1`);
}
bootstrap();
