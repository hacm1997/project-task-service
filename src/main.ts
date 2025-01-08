import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  if (new ConfigService().get('ENV_EXEC_CONF') === 'development') {
    dotenv.config({ path: './src/envs/envirotments/development.env' });
  } else {
    dotenv.config({ path: './src/envs/envirotments/production.env' });
  }
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Safe Routes Service')
    .setDescription('Service for safe routes applications')
    .setVersion('1.0.0')
    .addTag('Safe Routes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors({
    origin: process.env.APP_DOMAIN.split(','),
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Authorization, Accept, xsrfCookie',
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(8080);
  console.log('BOOTSTRAP');
}
bootstrap();
