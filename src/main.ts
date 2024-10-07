import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { LoggerService } from '@common/logger/logger.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: false, // true - Enable Debugging
    logger: new LoggerService(new ConfigService()),
  });
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Geek Framework')
    .setDescription("The geek framework's API REST Documentation")
    .setVersion('1.0')
    // .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
    })
  );
  const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000
  await app.listen(port, '0.0.0.0');
  const appUrl = await app.getUrl();
  Logger.log(`App is running on ${appUrl}`, 'Geek Framework');
}
bootstrap();
