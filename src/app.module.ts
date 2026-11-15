import { Module } from '@nestjs/common';
import { BarangModule } from './barang/barang.module.js';

@Module({
  imports: [BarangModule],
})
export class AppModule {}
