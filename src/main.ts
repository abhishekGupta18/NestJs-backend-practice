import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { LoggerService } from '@logger/logger.service';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: false, // true - Enable Debugging
    bufferLogs: false, // true - Enable Debugging
  });

  const logger = await app.resolve(LoggerService);
  app.useLogger(logger);

  // Apply Helmet Middleware for setting security-related HTTP headers
  app.use(helmet());

  // Enable CORS with specific settings
  app.enableCors({
    // origin: ['https://my-domain.com'], // Specify allowed origins
    origin: '*',
    credentials: true, // Include credentials in CORS requests
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Limit Request Size to 1MB
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Geek Framework')
      .setDescription("The geek framework's API REST Documentation")
      .setVersion('1.0')
      // .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Use global filters and pipes
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove non-whitelisted properties
      forbidNonWhitelisted: true, // Return an error for non-whitelisted properties
      transform: true, // Transform plain input objects to class instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  const appUrl = await app.getUrl();
  Logger.log(`App is running on ${appUrl}`, 'Geek Framework');
}

bootstrap();
