import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

// Data awal sama dengan array di Minggu 9, dijalankan dengan: npx prisma db seed
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const dataAwal = [
  { kode: 'BRG-001', nama: 'Beras Premium 5 kg', kategori: 'Sembako', satuan: 'Karung', stok: 48, harga: 75000, aktif: true, foto: 'beras.jpg', alt: 'Beras premium kemasan 5 kg', catatan: 'Kemasan karung 5 kg' },
  { kode: 'BRG-002', nama: 'Minyak Goreng 1 L', kategori: 'Sembako', satuan: 'Botol', stok: 12, harga: 19500, aktif: true, foto: 'minyak.jpg', alt: 'Minyak goreng kemasan 1 liter', catatan: '' },
  { kode: 'BRG-003', nama: 'Gula Pasir 1 kg', kategori: 'Sembako', satuan: 'Sak', stok: 6, harga: 17000, aktif: true, foto: 'gula.jpg', alt: 'Gula pasir kemasan 1 kilogram', catatan: '' },
  { kode: 'BRG-004', nama: 'Telur Ayam 1 kg', kategori: 'Sembako', satuan: 'Rak', stok: 8, harga: 30000, aktif: true, foto: 'telur.jpg', alt: 'Telur ayam kemasan 1 kilogram', catatan: '' },
  { kode: 'BRG-005', nama: 'Sabun Mandi Batang', kategori: 'Perawatan', satuan: 'Batang', stok: 120, harga: 6000, aktif: true, foto: 'sabun.jpg', alt: 'Sabun mandi batang', catatan: '' },
  { kode: 'BRG-006', nama: 'Kopi Bubuk 250 g', kategori: 'Minuman', satuan: 'Sachet', stok: 64, harga: 26000, aktif: false, foto: 'kopi.jpg', alt: 'Kopi bubuk kemasan 250 gram', catatan: '' },
];

async function main() {
  for (const barang of dataAwal) {
    await prisma.barang.upsert({ where: { kode: barang.kode }, update: barang, create: barang });
  }
  console.log(`${dataAwal.length} barang awal tersimpan`);
}

await main();
await prisma.$disconnect();
