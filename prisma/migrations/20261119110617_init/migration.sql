-- CreateTable
CREATE TABLE "barang" (
    "kode" VARCHAR(10) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "kategori" VARCHAR(30) NOT NULL,
    "satuan" VARCHAR(20) NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "harga" INTEGER NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "foto" TEXT NOT NULL DEFAULT '',
    "alt" TEXT NOT NULL DEFAULT '',
    "catatan" VARCHAR(200) NOT NULL DEFAULT '',
    "diperbarui" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barang_pkey" PRIMARY KEY ("kode")
);
