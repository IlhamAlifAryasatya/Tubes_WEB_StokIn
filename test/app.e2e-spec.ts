import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('Barang (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  it('GET /barang mengambil data dari database', async () => {
    const res = await request(app.getHttpServer()).get('/barang').expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /barang/ringkasan menghitung barang', async () => {
    const res = await request(app.getHttpServer()).get('/barang/ringkasan').expect(200);
    expect(res.body).toHaveProperty('menipis');
  });

  it('POST, PATCH, DELETE /barang', async () => {
    const server = app.getHttpServer();
    const baru = { kode: 'BRG-999', nama: 'Tepung Terigu 1 kg', kategori: 'Sembako', satuan: 'Sak', stok: 25, harga: 13000 };

    await request(server).post('/barang').send(baru).expect(201);
    await request(server).post('/barang').send(baru).expect(409);
    const ubah = await request(server).patch('/barang/BRG-999').send({ stok: 40 }).expect(200);
    expect(ubah.body.stok).toBe(40);
    await request(server).delete('/barang/BRG-999').expect(200);
    await request(server).get('/barang/BRG-999').expect(404);
  });

  it('POST /barang menolak data tidak valid', async () => {
    await request(app.getHttpServer()).post('/barang').send({ kode: 'X', nama: 'Te' }).expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
