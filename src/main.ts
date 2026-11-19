import 'dotenv/config';
import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { Express, Request, Response } from 'express';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Semua endpoint API diawali /api, contoh: /api/barang
  app.setGlobalPrefix('api');

  // Validasi DTO berlaku untuk semua endpoint.
  // whitelist membuang field yang tidak ada di DTO, forbidNonWhitelisted menolaknya.
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // Halaman StokIn (Minggu 2-5) ikut disajikan dari folder utama, jadi tampilan dan API
  // ada di alamat yang sama: http://localhost:3000
  // Hanya index.html, pages, dan assets yang dibuka, supaya src dan node_modules tidak ikut terbaca.
  const folderUtama = process.cwd();
  app.useStaticAssets(join(folderUtama, 'assets'), { prefix: '/assets' });
  app.useStaticAssets(join(folderUtama, 'pages'), { prefix: '/pages' });
  const server: Express = app.getHttpAdapter().getInstance();
  const kirimDashboard = (_req: Request, res: Response) => {
    res.sendFile(join(folderUtama, 'index.html'));
  };
  server.get('/', kirimDashboard);
  server.get('/index.html', kirimDashboard);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
