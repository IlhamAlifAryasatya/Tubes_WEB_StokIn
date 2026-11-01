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
| `ProdukPemasok` | – | Daftar produk pemasok dari API (Minggu 7) |
| `Footer` | – | Hak cipta |

Daftar barang disimpan sebagai state di `src/App.jsx` dan ditampilkan dengan `.map()`
memakai `kode` barang sebagai `key`. Data awal ada di `src/data/dataBarang.js`.

## Konsumsi API (Minggu 7)

Bagian **Produk dari Pemasok** mengambil data dari DummyJSON memakai `fetch()`:

```
GET https://dummyjson.com/products/category/groceries?limit=8&select=title,price,stock,thumbnail
```

Endpoint ini dipilih karena isinya produk kebutuhan dapur (minyak goreng, telur, daging, dan
lain-lain), jadi cocok dengan StokIn yang dipakai toko sembako. Pemilik toko bisa melihat
produk dan stok yang tersedia di pemasok sebelum belanja barang. DummyJSON gratis, tanpa
daftar akun atau API key, dan bisa diakses langsung dari browser (CORS). Datanya masih
berbahasa Inggris dan harganya dalam dolar karena berasal dari API.

Penanganan loading, berhasil, dan gagal ada di `src/components/ProdukPemasok.jsx`:

- State `status` berisi `"loading"`, `"berhasil"`, atau `"gagal"`. Nilai awalnya `"loading"`,
  jadi spinner "Memuat produk pemasok..." langsung tampil saat halaman dibuka.
- Fungsi `ambilProduk()` di dalam `useEffect` memanggil `fetch()`. Kalau `respons.ok` bernilai
  false atau koneksi putus, `catch` mengubah `status` menjadi `"gagal"`. Kalau berhasil, data
  disimpan ke state `produk` dan `status` menjadi `"berhasil"`.
- Saat berhasil, `produk.map()` menampilkan kartu produk dengan `key={item.id}`.
- Saat gagal, muncul pesan error dan tombol **Coba Lagi**. Fungsi `cobaLagi()` mengembalikan
  `status` ke `"loading"` lalu menambah state `percobaan`. Karena `percobaan` ada di dependency
  `useEffect`, `ambilProduk()` dijalankan ulang.

## Screenshot

- Minggu 6: `docs/screenshots/minggu-6/`
- Minggu 7 (loading, berhasil, error): `docs/screenshots/minggu-7/`. Kondisi loading diambil
  dengan menahan request ke API, kondisi error dengan memblokir request tersebut.
