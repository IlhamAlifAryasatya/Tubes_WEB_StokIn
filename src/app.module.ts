import { Module } from '@nestjs/common';
import { BarangModule } from './barang/barang.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, BarangModule],
})
export class AppModule {}
