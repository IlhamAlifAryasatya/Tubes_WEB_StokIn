# StokIn

## Topik

Pengembangan Aplikasi Web Manajemen Stok Barang Berbasis Web untuk Usaha Kecil dan Menengah

## Nama Aplikasi

StokIn

## Deskripsi Aplikasi

StokIn adalah aplikasi web untuk membantu pemilik toko atau gudang kecil mencatat stok barang.
Pemilik usaha sering masih mencatat stok di buku atau file Excel, yang cepat tercecer dan sering
menyebabkan salah hitung. StokIn menggantikan catatan manual itu dengan satu daftar barang yang
selalu bisa dicek ulang.

Barang yang datang dari pemasok dicatat sebagai barang masuk, barang yang keluar dicatat sebagai
barang keluar, dan barang yang dikembalikan baik ke pemasok maupun dari pembeli dicatat sebagai
retur. Setiap pencatatan itu langsung memperbarui jumlah stok di katalog, sehingga pemilik tidak
perlu menghitung ulang sendiri. Barang yang jumlahnya menipis ditandai di dashboard supaya bisa
segera dipesan ulang, dan barang yang sudah tidak dijual bisa dinonaktifkan tanpa menghapus
riwayatnya.

Katalog barang mengelompokkan barang per kategori, lengkap dengan kode dan satuan supaya barang
tidak tertukar. Data stok hanya bisa dibuka oleh akun yang terdaftar, dan identitas toko disimpan
di halaman profil untuk dipakai pada laporan.

## Alasan Memilih Bootstrap

Sebagian besar halaman StokIn berisi tabel data barang dan form pencatatan (tambah barang, barang
masuk, barang keluar, retur). Bootstrap sudah menyediakan komponen tabel, form, kartu, dan badge
yang siap dipakai, jadi waktu pengerjaan bisa difokuskan ke alur aplikasinya.

Aplikasi ini juga akan dipakai pemilik toko lewat HP. Sistem grid Bootstrap (`container`, `row`,
`col`) memudahkan tampilan berubah dari beberapa kolom di laptop menjadi satu kolom di HP, dan
komponen offcanvas dipakai untuk sidebar yang di HP berubah menjadi menu geser.

Bootstrap cukup dipasang lewat CDN tanpa proses build, sehingga nanti tetap mudah digabungkan
dengan backend apa pun pada tahap fullstack.

## Screenshot

Screenshot setiap tahap ada di folder `docs/screenshots`:

- `minggu-2` : struktur HTML tanpa CSS
- `minggu-3` : styling dengan CSS native (desktop dan mobile)
- `minggu-4` : kerangka tampilan dengan Bootstrap (desktop dan mobile)
