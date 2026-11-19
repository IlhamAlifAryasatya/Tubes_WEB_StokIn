import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BarangService } from './barang.service.js';
import { CreateBarangDto } from './dto/create-barang.dto.js';
import { UpdateBarangDto } from './dto/update-barang.dto.js';

@Controller('barang')
export class BarangController {
  constructor(private readonly barangService: BarangService) {}

  @Post()
  create(@Body() createBarangDto: CreateBarangDto) {
    return this.barangService.create(createBarangDto);
  }

  @Get()
  findAll() {
    return this.barangService.findAll();
  }

  @Get('ringkasan')
  ringkasan() {
    return this.barangService.ringkasan();
  }

  @Get(':kode')
  findOne(@Param('kode') kode: string) {
    return this.barangService.findOne(kode);
  }

  @Patch(':kode')
  update(@Param('kode') kode: string, @Body() updateBarangDto: UpdateBarangDto) {
    return this.barangService.update(kode, updateBarangDto);
  }

  @Delete(':kode')
  remove(@Param('kode') kode: string) {
    return this.barangService.remove(kode);
  }
}
