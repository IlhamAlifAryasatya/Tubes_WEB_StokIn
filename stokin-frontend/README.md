# StokIn Frontend (React)

Frontend StokIn versi React untuk Tugas Besar Minggu 6. Entitas utama: **Barang**.
Versi HTML, CSS, Bootstrap, dan jQuery (Minggu 2–5) tetap ada di folder utama repository.

## Menjalankan

```bash
cd stokin-frontend
npm install
npm run dev
```

Buka http://localhost:5173

## Component

| Component | Props | Isi |
|---|---|---|
| `Header` | `namaToko` | Logo, menu, dan nama toko |
| `RingkasanStok` | `daftarBarang` | Jumlah barang aktif, nonaktif, total nilai stok, stok menipis |
| `FormTambahBarang` | `onTambah` | Form tambah barang (controlled component) |
| `DaftarBarang` | `daftarBarang`, `onHapus` | Daftar kartu barang, atau teks "Belum ada data barang" jika kosong |
| `KartuBarang` | `kode`, `nama`, `kategori`, `satuan`, `stok`, `harga`, `aktif`, `foto`, `onHapus` | Kartu satu barang |
| `Footer` | – | Hak cipta |

Daftar barang disimpan sebagai state di `src/App.jsx` dan ditampilkan dengan `.map()`
memakai `kode` barang sebagai `key`. Data awal ada di `src/data/dataBarang.js`.

## Screenshot

Ada di `docs/screenshots/minggu-6/`.
