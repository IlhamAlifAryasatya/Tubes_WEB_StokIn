import { Module } from '@nestjs/common';
import { BarangService } from './barang.service.js';
import { BarangController } from './barang.controller.js';

@Module({
  controllers: [BarangController],
  providers: [BarangService],
})
export class BarangModule {}
