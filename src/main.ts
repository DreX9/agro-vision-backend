import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

/**
 * @description Inicialización del servidor backend de Agro Vision.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir peticiones desde Expo Web y Móvil
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Prefijo global de API
  app.setGlobalPrefix('api/v1');

  // Pipe de validación global con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de documentación OpenAPI / Swagger
  const config = new DocumentBuilder()
    .setTitle('Agro Vision API')
    .setDescription('API REST de gestión agrícola inteligente, visión computacional y telemetría')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const puerto = process.env.PORT ?? 3000;
  await app.listen(puerto);
  console.log(`🚀 Agro Vision Backend ejecutándose en http://localhost:${puerto}/api/v1`);
  console.log(`📄 Documentación Swagger interactiva en http://localhost:${puerto}/api/docs`);
}

await bootstrap();
