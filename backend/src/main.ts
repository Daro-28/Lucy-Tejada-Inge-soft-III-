import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS para el frontend
  app.enableCors({ origin: 'http://localhost:5173' });

  // ─── Swagger ────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Sistema Centro Cultural Lucy Tejada')
    .setDescription('API REST del sistema de gestión cultural')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token', // nombre de la seguridad — se usa en los controladores
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // disponible en /api
  // ────────────────────────────────────────────────────────

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Backend: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();