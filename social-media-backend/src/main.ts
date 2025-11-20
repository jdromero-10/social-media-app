import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilitar CORS PRIMERO para que se aplique a todos los recursos, incluyendo estáticos
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Middleware para agregar headers CORS a archivos estáticos
  // IMPORTANTE: Debe estar ANTES de useStaticAssets para que funcione correctamente
  app.use('/images', (req, res, next) => {
    // Agregar headers CORS explícitamente
    res.header('Access-Control-Allow-Origin', frontendUrl);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    
    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    next();
  });

  // Configurar carpeta de imágenes estáticas (después del middleware CORS)
  app.useStaticAssets(join(__dirname, '..', 'images'), {
    prefix: '/images/',
  });

  // Configurar cookie-parser
  app.use(cookieParser.default());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );
  await app.listen(process.env.PORT ?? 3006);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3006}`,
  );
}
void bootstrap();
