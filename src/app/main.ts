import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { internalConfig } from '@/common/config';
import { InternalLogger } from '@/common/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

const logger = new InternalLogger('App');

process.on('unhandledRejection', (reason: any, promise: any) => {
  logger.error(reason, promise);
  process.exit(1);
});

process.on('uncaughtException', (error: Error, source: any) => {
  logger.error(error, source);
  process.exit(1);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // CORS
  if (internalConfig.nodeEnv === 'production') {

    const allowedOrigins = internalConfig.settings.clientHosts.split(',');
    app.enableCors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
  } else {
    app.enableCors();
  }

  // SWAGGER
  const options = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription(
      'This API provides functionality to manage users. It allows for creating, updating, retrieving, and deleting users.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/api-doc', app, document);

  // VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  logger.info(`Application is running on port: ${internalConfig.app.port}`);
  await app.listen(internalConfig.app.port);
}

bootstrap();
