const dataBarang = [
  { kode: "BRG-001", nama: "Beras Premium 5 kg", kategori: "Sembako", satuan: "Karung", stok: 48, harga: 75000, aktif: true, foto: "/img/beras.jpg" },
  { kode: "BRG-002", nama: "Minyak Goreng 1 L", kategori: "Sembako", satuan: "Botol", stok: 12, harga: 19500, aktif: true, foto: "/img/minyak.jpg" },
  { kode: "BRG-003", nama: "Gula Pasir 1 kg", kategori: "Sembako", satuan: "Sak", stok: 6, harga: 17000, aktif: true, foto: "/img/gula.jpg" },
  { kode: "BRG-004", nama: "Telur Ayam 1 kg", kategori: "Sembako", satuan: "Rak", stok: 8, harga: 30000, aktif: true, foto: "/img/telur.jpg" },
  { kode: "BRG-005", nama: "Sabun Mandi Batang", kategori: "Perawatan", satuan: "Batang", stok: 120, harga: 6000, aktif: true, foto: "/img/sabun.jpg" },
  { kode: "BRG-006", nama: "Kopi Bubuk 250 g", kategori: "Minuman", satuan: "Sachet", stok: 64, harga: 26000, aktif: false, foto: "/img/kopi.jpg" },
];

export const BATAS_MENIPIS = 10;

export const daftarKategori = ["Sembako", "Minuman", "Perawatan"];

export function formatRupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

export default dataBarang;
