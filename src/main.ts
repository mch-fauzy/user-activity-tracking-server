import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from './app.module';
import { config } from './config';
import { ApiKeyAuthTypeEnum } from './infrastructures/modules/api-key/enums/api-key-type.enum';
import { JwtAuthTypeEnum } from './infrastructures/modules/jwt/enums/jwt-type.enum';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors();

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('User Activity Tracking API')
    .setDescription(
      'API documentation for User Activity Tracking System with advanced caching and high-traffic handling',
    )
    .setVersion('1.0')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Logs', 'Activity logging endpoints')
    .addTag('Usage', 'Usage analytics endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT access token',
        in: 'header',
      },
      JwtAuthTypeEnum.AccessToken,
    )
    .addSecurity(ApiKeyAuthTypeEnum.ApiKey, {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'API Key',
      name: 'API Key',
      description: 'Enter your API key (received during registration)',
      in: 'header',
    })
    .build();

  const openApiDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(openApiDoc), {
    customSiteTitle: 'User Activity Tracking API',
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
    ],
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js',
    ],
  });

  await app.listen(config.app.port);

  logger.log(`Application is running on: http://localhost:${config.app.port}`);
  logger.log(`Swagger documentation: http://localhost:${config.app.port}/api`);
}

void bootstrap();
