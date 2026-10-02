import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  // Increase payload size limit to accept base64 image strings
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
