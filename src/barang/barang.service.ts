import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBarangDto } from './dto/create-barang.dto.js';
import { UpdateBarangDto } from './dto/update-barang.dto.js';

const BATAS_MENIPIS = 10; // sama dengan batas di assets/js/script.js

@Injectable()
export class BarangService {
  // Data barang sekarang disimpan di tabel "barang" PostgreSQL lewat Prisma
  constructor(private readonly prisma: PrismaService) {}

  async create(createBarangDto: CreateBarangDto) {
    const barangLama = await this.prisma.barang.findUnique({
      where: { kode: createBarangDto.kode },
    });
    if (barangLama) {
      throw new ConflictException(`Kode ${createBarangDto.kode} sudah dipakai ${barangLama.nama}`);
    }

    return this.prisma.barang.create({ data: createBarangDto });
  }

  findAll() {
    return this.prisma.barang.findMany({ orderBy: { kode: 'asc' } });
  }

  async findOne(kode: string) {
    const barang = await this.prisma.barang.findUnique({ where: { kode } });
    if (!barang) {
      throw new NotFoundException(`Barang dengan kode ${kode} tidak ditemukan`);
    }
    return barang;
  }

  async update(kode: string, updateBarangDto: UpdateBarangDto) {
    await this.findOne(kode);
    return this.prisma.barang.update({ where: { kode }, data: updateBarangDto });
  }

  async remove(kode: string) {
    await this.findOne(kode);
    return this.prisma.barang.delete({ where: { kode } });
  }

  // Jumlah barang aktif, nonaktif, dan yang stoknya menipis (count + where)
  async ringkasan() {
    const [aktif, nonaktif, menipis] = await Promise.all([
      this.prisma.barang.count({ where: { aktif: true } }),
      this.prisma.barang.count({ where: { aktif: false } }),
      this.prisma.barang.count({ where: { aktif: true, stok: { lt: BATAS_MENIPIS } } }),
    ]);
    return { aktif, nonaktif, menipis };
  }
}
