import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { TotemModule } from './totem/totem.module';

async function bootstrap() {
  patchNestJsSwagger();
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .addServer('https://backend.murata.com.ar/portal-clientes')
    .setTitle('Portal Clientes - Murata')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const totemDocs = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [TotemModule],
  });
  SwaggerModule.setup('docs/totem', app, totemDocs);

  const config = app.get(ConfigService);
  await app.listen(config.get('HTTP_PORT'));
}
bootstrap();
