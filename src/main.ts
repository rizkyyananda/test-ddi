import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SequelizeExceptionFilter } from './handler/squlize-error-handler';
import { HttpExceptionFilter } from './handler/exception-error-handller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Swagger Config
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
      },
      'access-token',
    )
    .addTag('auth')
    .addTag('Users')
    .addTag('Articles')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  app.useGlobalFilters(new HttpExceptionFilter(),
  );

  await app.listen(process.env.PORT ?? 9000);
}
bootstrap();
