import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBarangDto } from './dto/create-barang.dto.js';
import { UpdateBarangDto } from './dto/update-barang.dto.js';
import { Barang } from './entities/barang.entity.js';

@Injectable()
export class BarangService {
  // Data disimpan sementara di memori, kembali seperti semula kalau server dinyalakan ulang.
  private daftarBarang: Barang[] = [
    { kode: 'BRG-001', nama: 'Beras Premium 5 kg', kategori: 'Sembako', satuan: 'Karung', stok: 48, harga: 75000, aktif: true, foto: 'beras.jpg', alt: 'Beras premium kemasan 5 kg', catatan: 'Kemasan karung 5 kg', diperbarui: new Date() },
    { kode: 'BRG-002', nama: 'Minyak Goreng 1 L', kategori: 'Sembako', satuan: 'Botol', stok: 12, harga: 19500, aktif: true, foto: 'minyak.jpg', alt: 'Minyak goreng kemasan 1 liter', catatan: '', diperbarui: new Date() },
    { kode: 'BRG-003', nama: 'Gula Pasir 1 kg', kategori: 'Sembako', satuan: 'Sak', stok: 6, harga: 17000, aktif: true, foto: 'gula.jpg', alt: 'Gula pasir kemasan 1 kilogram', catatan: '', diperbarui: new Date() },
    { kode: 'BRG-004', nama: 'Telur Ayam 1 kg', kategori: 'Sembako', satuan: 'Rak', stok: 8, harga: 30000, aktif: true, foto: 'telur.jpg', alt: 'Telur ayam kemasan 1 kilogram', catatan: '', diperbarui: new Date() },
    { kode: 'BRG-005', nama: 'Sabun Mandi Batang', kategori: 'Perawatan', satuan: 'Batang', stok: 120, harga: 6000, aktif: true, foto: 'sabun.jpg', alt: 'Sabun mandi batang', catatan: '', diperbarui: new Date() },
    { kode: 'BRG-006', nama: 'Kopi Bubuk 250 g', kategori: 'Minuman', satuan: 'Sachet', stok: 64, harga: 26000, aktif: false, foto: 'kopi.jpg', alt: 'Kopi bubuk kemasan 250 gram', catatan: '', diperbarui: new Date() },
  ];

  create(createBarangDto: CreateBarangDto) {
    const barangLama = this.daftarBarang.find((item) => item.kode === createBarangDto.kode);
    if (barangLama) {
      throw new ConflictException(`Kode ${createBarangDto.kode} sudah dipakai ${barangLama.nama}`);
    }

    const barangBaru: Barang = {
      kode: createBarangDto.kode,
      nama: createBarangDto.nama,
      kategori: createBarangDto.kategori,
      satuan: createBarangDto.satuan,
      stok: createBarangDto.stok,
      harga: createBarangDto.harga,
      aktif: createBarangDto.aktif ?? true,
      foto: '',
      alt: '',
      catatan: createBarangDto.catatan ?? '',
      diperbarui: new Date(),
    };
    this.daftarBarang.push(barangBaru);
    return barangBaru;
  }

  findAll() {
    return this.daftarBarang;
  }

  findOne(kode: string) {
    const barang = this.daftarBarang.find((item) => item.kode === kode);
    if (!barang) {
      throw new NotFoundException(`Barang dengan kode ${kode} tidak ditemukan`);
    }
    return barang;
  }

  update(kode: string, updateBarangDto: UpdateBarangDto) {
    const barang = this.findOne(kode);
    Object.assign(barang, updateBarangDto, { diperbarui: new Date() });
    return barang;
  }

  remove(kode: string) {
    const barang = this.findOne(kode);
    this.daftarBarang = this.daftarBarang.filter((item) => item.kode !== kode);
    return barang;
  }
}
