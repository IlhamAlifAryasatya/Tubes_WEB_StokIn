/* StokIn - interaksi sisi client.
   Data masih dummy: disimpan di array dan kembali seperti semula
   setiap halaman dimuat ulang. */

// ===== Data dummy =====

const BATAS_MENIPIS = 10; // stok di bawah angka ini ditandai menipis

const daftarBarang = [
  { kode: "BRG-001", nama: "Beras Premium 5 kg", kategori: "Sembako", satuan: "Karung", stok: 48, harga: 75000, aktif: true, foto: "beras.jpg", alt: "Beras premium kemasan 5 kg", catatan: "Kemasan karung 5 kg" },
  { kode: "BRG-002", nama: "Minyak Goreng 1 L", kategori: "Sembako", satuan: "Botol", stok: 12, harga: 19500, aktif: true, foto: "minyak.jpg", alt: "Minyak goreng kemasan 1 liter", catatan: "" },
  { kode: "BRG-003", nama: "Gula Pasir 1 kg", kategori: "Sembako", satuan: "Sak", stok: 6, harga: 17000, aktif: true, foto: "gula.jpg", alt: "Gula pasir kemasan 1 kilogram", catatan: "" },
  { kode: "BRG-004", nama: "Telur Ayam 1 kg", kategori: "Sembako", satuan: "Rak", stok: 8, harga: 30000, aktif: true, foto: "telur.jpg", alt: "Telur ayam kemasan 1 kilogram", catatan: "" },
  { kode: "BRG-005", nama: "Sabun Mandi Batang", kategori: "Perawatan", satuan: "Batang", stok: 120, harga: 6000, aktif: true, foto: "sabun.jpg", alt: "Sabun mandi batang", catatan: "" },
  { kode: "BRG-006", nama: "Kopi Bubuk 250 g", kategori: "Minuman", satuan: "Sachet", stok: 64, harga: 26000, aktif: false, foto: "kopi.jpg", alt: "Kopi bubuk kemasan 250 gram", catatan: "" }
];

const riwayatMasuk = [
  { tanggal: "2026-09-27", kode: "BRG-001", jumlah: 20, hargaBeli: 72000, keterangan: "Pembelian bulanan" },
  { tanggal: "2026-09-26", kode: "BRG-002", jumlah: 24, hargaBeli: 18500, keterangan: "Pembelian dari CV Sinar" },
  { tanggal: "2026-09-25", kode: "BRG-005", jumlah: 100, hargaBeli: 5500, keterangan: "Restok" },
  { tanggal: "2026-09-24", kode: "BRG-004", jumlah: 10, hargaBeli: 29000, keterangan: "Pembelian harian" }
];

const riwayatKeluar = [
  { tanggal: "2026-09-27", kode: "BRG-001", jumlah: 5, alasan: "Terjual", penerima: "Warung Bu Imas" },
  { tanggal: "2026-09-27", kode: "BRG-002", jumlah: 6, alasan: "Terjual", penerima: "Warung Bu Imas" },
  { tanggal: "2026-09-26", kode: "BRG-003", jumlah: 4, alasan: "Terjual", penerima: "Katering Bu Tini" },
  { tanggal: "2026-09-25", kode: "BRG-004", jumlah: 6, alasan: "Rusak", penerima: "-" }
];

const riwayatRetur = [
  { tanggal: "2026-09-26", jenis: "Retur ke Supplier", kode: "BRG-002", jumlah: 2, alasan: "Barang rusak" },
  { tanggal: "2026-09-25", jenis: "Retur dari Pembeli", kode: "BRG-001", jumlah: 1, alasan: "Tidak sesuai pesanan" },
  { tanggal: "2026-09-24", jenis: "Retur ke Supplier", kode: "BRG-003", jumlah: 3, alasan: "Kadaluarsa" }
];

// ===== Fungsi pengolah data =====

// 75000 -> "Rp75.000"
function formatRupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

// "2026-09-27" -> "27 Sep 2026"
function formatTanggal(teks) {
  const namaBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const bagian = teks.split("-");
  return Number(bagian[2]) + " " + namaBulan[Number(bagian[1]) - 1] + " " + bagian[0];
}

function cariBarang(kode) {
  for (let i = 0; i < daftarBarang.length; i++) {
    if (daftarBarang[i].kode === kode) {
      return daftarBarang[i];
    }
  }
  return null;
}

// menghitung angka-angka untuk kartu di dashboard
function hitungRingkasan() {
  const ringkasan = { aktif: 0, nonaktif: 0, nilaiStok: 0, menipis: [] };

  for (const barang of daftarBarang) {
    if (barang.aktif) {
      ringkasan.aktif++;
      ringkasan.nilaiStok += barang.stok * barang.harga;
      if (barang.stok < BATAS_MENIPIS) {
        ringkasan.menipis.push(barang);
      }
    } else {
      ringkasan.nonaktif++;
    }
  }
  return ringkasan;
}

// mencari barang berdasarkan nama/kode dan kategori
function filterBarang(kataKunci, kategori) {
  const kata = kataKunci.trim().toLowerCase();

  return daftarBarang.filter(function (barang) {
    const cocokKata = barang.nama.toLowerCase().includes(kata) || barang.kode.toLowerCase().includes(kata);
    const cocokKategori = kategori === "" || barang.kategori.toLowerCase() === kategori;
    return cocokKata && cocokKategori;
  });
}

function badgeStatus(barang) {
  if (barang.aktif) {
    return '<span class="badge rounded-pill bg-success-subtle text-success-emphasis">Aktif</span>';
  }
  return '<span class="badge rounded-pill bg-secondary-subtle text-secondary-emphasis">Nonaktif</span>';
}

function barisKosong(jumlahKolom, teks) {
  return `<tr><td colspan="${jumlahKolom}" class="text-center text-body-secondary py-3">${teks}</td></tr>`;
}

// ===== Pesan dan validasi form =====

function tampilkanPesan(jenis, teks) {
  $("#pesan")
    .stop(true, true)
    .removeClass("alert-success alert-danger")
    .addClass("alert-" + jenis)
    .text(teks)
    .hide()
    .slideDown(250);
}

// mengembalikan daftar label field wajib yang masih kosong
function cekFieldKosong(form) {
  const kosong = [];

  form.find("[required]").each(function () {
    if ($(this).val().trim() === "") {
      $(this).addClass("is-invalid");
      kosong.push($("label[for='" + this.id + "']").text());
    } else {
      $(this).removeClass("is-invalid");
    }
  });
  return kosong;
}

// ===== Dashboard =====

function tampilkanDashboard() {
  const ringkasan = hitungRingkasan();

  $("#jumlah-aktif").text(ringkasan.aktif);
  $("#jumlah-nonaktif").text(ringkasan.nonaktif);
  $("#nilai-stok").text(formatRupiah(ringkasan.nilaiStok));
  $("#jumlah-menipis").text(ringkasan.menipis.length);

  let baris = "";
  for (const barang of ringkasan.menipis) {
    baris += `<tr>
      <td class="d-none d-md-table-cell">${barang.kode}</td>
      <td>${barang.nama}</td>
      <td><span class="badge rounded-pill bg-warning-subtle text-warning-emphasis">${barang.stok} ${barang.satuan}</span></td>
      <td><a href="pages/transaksi/masuk.html?kode=${barang.kode}">Catat Barang Masuk</a></td>
    </tr>`;
  }
  if (ringkasan.menipis.length === 0) {
    baris = barisKosong(4, "Semua stok masih aman");
  }
  $("#tabel-menipis tbody").html(baris);
}

// ===== Katalog =====

let kategoriDipilih = "";

function tampilkanKatalog() {
  const hasil = filterBarang($("#cari").val(), kategoriDipilih);
  let barisAktif = "";
  let barisNonaktif = "";

  for (const barang of hasil) {
    const baris = `<tr>
      <td class="d-none d-md-table-cell">${barang.kode}</td>
      <td>
        <img src="../../assets/img/${barang.foto}" alt="${barang.alt}" width="40" height="40" class="rounded-3 object-fit-cover me-2 d-none d-md-inline">
        <a href="detail.html?kode=${barang.kode}" class="link-body-emphasis fw-semibold text-decoration-none">${barang.nama}</a>
      </td>
      <td class="d-none d-md-table-cell">${barang.kategori}</td>
      <td class="d-none d-md-table-cell">${barang.satuan}</td>
      <td>${barang.stok}</td>
      <td>${formatRupiah(barang.harga)}</td>
      <td>${badgeStatus(barang)}</td>
    </tr>`;

    if (barang.aktif) {
      barisAktif += baris;
    } else {
      barisNonaktif += baris;
    }
  }

  if (barisAktif === "") {
    barisAktif = barisKosong(7, "Barang tidak ditemukan");
  }
  if (barisNonaktif === "") {
    barisNonaktif = barisKosong(7, "Barang tidak ditemukan");
  }
  $("#tabel-aktif tbody").html(barisAktif);
  $("#tabel-nonaktif tbody").html(barisNonaktif);
}

function pilihKategori(kategori) {
  kategoriDipilih = kategori;
  $("#tab-kategori .nav-link").removeClass("active").removeAttr("aria-current");
  $(`#tab-kategori .nav-link[data-kategori="${kategori}"]`).addClass("active").attr("aria-current", "page");
}

// ===== Detail dan ubah barang =====

// barang yang dibuka diambil dari alamat, misalnya detail.html?kode=BRG-003
function barangDariAlamat() {
  const kode = new URLSearchParams(window.location.search).get("kode");
  return cariBarang(kode) || daftarBarang[0];
}

function tampilkanDetail() {
  const barang = barangDariAlamat();

  document.title = barang.nama + " - StokIn";
  $("#detail-nama").text(barang.nama);
  $("#detail-foto").attr({ src: "../../assets/img/" + barang.foto, alt: barang.alt });
  $("#detail-kode").text(barang.kode);
  $("#detail-kategori").text(barang.kategori);
  $("#detail-satuan").text(barang.satuan);
  $("#detail-stok").text(barang.stok + " " + barang.satuan);
  $("#detail-harga").text(formatRupiah(barang.harga));
  $("#detail-status").html(badgeStatus(barang));
  $("#tombol-ubah").attr("href", "ubah.html?kode=" + barang.kode);
}

function isiFormUbah() {
  const barang = barangDariAlamat();

  $("#kode").val(barang.kode);
  $("#nama").val(barang.nama);
  $("#kategori").val(barang.kategori.toLowerCase());
  $("#satuan").val(barang.satuan.toLowerCase());
  $("#stok").val(barang.stok);
  $("#harga").val(barang.harga);
  $("#catatan").val(barang.catatan);
  $("#status").val(barang.aktif ? "aktif" : "nonaktif");
}

// ===== Transaksi (masuk, keluar, retur) =====

function isiPilihanBarang() {
  let opsi = '<option value="">Pilih barang</option>';
  for (const barang of daftarBarang) {
    if (barang.aktif) {
      opsi += `<option value="${barang.kode}">${barang.nama}</option>`;
    }
  }
  $("#barang").html(opsi);
}

function tampilkanRiwayat(jenis) {
  let baris = "";

  if (jenis === "masuk") {
    for (const data of riwayatMasuk) {
      const barang = cariBarang(data.kode);
      baris += `<tr>
        <td>${formatTanggal(data.tanggal)}</td>
        <td>${barang.nama}</td>
        <td>${data.jumlah} ${barang.satuan}</td>
        <td>${formatRupiah(data.hargaBeli)}</td>
        <td class="d-none d-md-table-cell">${data.keterangan}</td>
      </tr>`;
    }
  } else if (jenis === "keluar") {
    for (const data of riwayatKeluar) {
      const barang = cariBarang(data.kode);
      baris += `<tr>
        <td>${formatTanggal(data.tanggal)}</td>
        <td>${barang.nama}</td>
        <td>${data.jumlah} ${barang.satuan}</td>
        <td>${data.alasan}</td>
        <td class="d-none d-md-table-cell">${data.penerima}</td>
      </tr>`;
    }
  } else {
    for (const data of riwayatRetur) {
      const barang = cariBarang(data.kode);
      baris += `<tr>
        <td>${formatTanggal(data.tanggal)}</td>
        <td>${data.jenis}</td>
        <td>${barang.nama}</td>
        <td>${data.jumlah} ${barang.satuan}</td>
        <td class="d-none d-md-table-cell">${data.alasan}</td>
      </tr>`;
    }
  }

  $("#tabel-riwayat tbody").html(baris);
}

function simpanTransaksi(form) {
  const jenis = form.data("jenis");
  const barang = cariBarang($("#barang").val());
  const jumlah = Number($("#jumlah").val());
  const tanggal = $("#tanggal").val();
  const keterangan = $("#keterangan").val().trim() || "-";

  if (jumlah < 1) {
    $("#jumlah").addClass("is-invalid");
    tampilkanPesan("danger", "Jumlah minimal 1.");
    return;
  }

  // barang keluar dan retur ke supplier mengurangi stok, sisanya menambah
  const mengurangiStok = jenis === "keluar" || (jenis === "retur" && $("#tipe").val() === "ke_supplier");

  if (mengurangiStok && jumlah > barang.stok) {
    $("#jumlah").addClass("is-invalid");
    tampilkanPesan("danger", `Stok ${barang.nama} tinggal ${barang.stok} ${barang.satuan}.`);
    return;
  }

  if (mengurangiStok) {
    barang.stok -= jumlah;
  } else {
    barang.stok += jumlah;
  }

  // data baru ditaruh paling atas supaya riwayat urut dari yang terbaru
  if (jenis === "masuk") {
    riwayatMasuk.unshift({ tanggal: tanggal, kode: barang.kode, jumlah: jumlah, hargaBeli: Number($("#harga_beli").val()), keterangan: keterangan });
  } else if (jenis === "keluar") {
    riwayatKeluar.unshift({ tanggal: tanggal, kode: barang.kode, jumlah: jumlah, alasan: $("#alasan option:selected").text(), penerima: $("#penerima").val().trim() || "-" });
  } else {
    riwayatRetur.unshift({ tanggal: tanggal, jenis: $("#tipe option:selected").text(), kode: barang.kode, jumlah: jumlah, alasan: $("#alasan option:selected").text() });
  }

  tampilkanRiwayat(jenis);
  $("#tabel-riwayat tbody tr:first").hide().fadeIn(800);
  tampilkanPesan("success", `Tersimpan. Stok ${barang.nama} sekarang ${barang.stok} ${barang.satuan}.`);

  form[0].reset();
  $("#info-stok").fadeOut(200);
}

// ===== Event handling =====

$(function () {
  // dashboard
  if ($("#tabel-menipis").length > 0) {
    tampilkanDashboard();
  }

  // katalog
  if ($("#tabel-aktif").length > 0) {
    // isian dari form cari di dashboard ikut dipakai, misalnya katalog.html?cari=gula
    const alamat = new URLSearchParams(window.location.search);
    $("#cari").val(alamat.get("cari") || "");
    pilihKategori(alamat.get("kategori") || "");
    tampilkanKatalog();

    $("#cari").on("input", tampilkanKatalog);

    $("#form-cari").on("submit", function (e) {
      e.preventDefault();
      tampilkanKatalog();
    });

    $("#tab-kategori .nav-link").on("click", function (e) {
      e.preventDefault();
      pilihKategori($(this).attr("data-kategori"));
      tampilkanKatalog();
      $("#tabel-aktif tbody, #tabel-nonaktif tbody").hide().fadeIn(300);
    });
  }

  // detail dan ubah barang
  if ($("#detail-nama").length > 0) {
    tampilkanDetail();
  }
  if ($("#form-ubah").length > 0) {
    isiFormUbah();
  }

  // transaksi
  if ($("#form-transaksi").length > 0) {
    const jenis = $("#form-transaksi").data("jenis");
    isiPilihanBarang();
    tampilkanRiwayat(jenis);

    // sisa stok muncul begitu barang dipilih
    $("#barang").on("change", function () {
      const barang = cariBarang($(this).val());
      if (barang) {
        $("#info-stok").text(`Sisa stok: ${barang.stok} ${barang.satuan}`).fadeIn(200);
      } else {
        $("#info-stok").fadeOut(200);
      }
    });

    // dari tombol "Catat Barang Masuk" di dashboard, barangnya langsung terpilih
    const kode = new URLSearchParams(window.location.search).get("kode");
    if (kode) {
      $("#barang").val(kode).trigger("change");
    }

    $("#form-transaksi").on("submit", function (e) {
      e.preventDefault();
      const kosong = cekFieldKosong($(this));
      if (kosong.length > 0) {
        tampilkanPesan("danger", "Lengkapi dulu: " + kosong.join(", ") + ".");
        return;
      }
      simpanTransaksi($(this));
    });
  }

  // tambah barang
  $("#form-tambah").on("submit", function (e) {
    e.preventDefault();
    const kosong = cekFieldKosong($(this));
    if (kosong.length > 0) {
      tampilkanPesan("danger", "Lengkapi dulu: " + kosong.join(", ") + ".");
      return;
    }

    const kode = $("#kode").val().trim().toUpperCase();
    const barangLama = cariBarang(kode);
    if (barangLama) {
      $("#kode").addClass("is-invalid");
      tampilkanPesan("danger", `Kode ${kode} sudah dipakai ${barangLama.nama}.`);
      return;
    }

    daftarBarang.push({
      kode: kode,
      nama: $("#nama").val().trim(),
      kategori: $("#kategori option:selected").text(),
      satuan: $("#satuan option:selected").text(),
      stok: Number($("#stok").val()),
      harga: Number($("#harga").val()),
      aktif: true,
      foto: "",
      alt: "",
      catatan: $("#catatan").val().trim()
    });
    tampilkanPesan("success", `${$("#nama").val().trim()} ditambahkan ke katalog.`);
    this.reset();
  });

  // ubah barang
  $("#form-ubah").on("submit", function (e) {
    e.preventDefault();
    const kosong = cekFieldKosong($(this));
    if (kosong.length > 0) {
      tampilkanPesan("danger", "Lengkapi dulu: " + kosong.join(", ") + ".");
      return;
    }

    const barang = cariBarang($("#kode").val());
    barang.nama = $("#nama").val().trim();
    barang.harga = Number($("#harga").val());
    barang.aktif = $("#status").val() === "aktif";
    tampilkanPesan("success", `Perubahan ${barang.nama} disimpan.`);
  });

  // form akun dan profil: cukup dicek kosong atau tidak, lalu pindah halaman bila perlu
  $(".form-cek").on("submit", function (e) {
    e.preventDefault();
    const form = $(this);
    const kosong = cekFieldKosong(form);
    if (kosong.length > 0) {
      tampilkanPesan("danger", "Lengkapi dulu: " + kosong.join(", ") + ".");
      return;
    }

    tampilkanPesan("success", form.data("berhasil"));
    const tujuan = form.data("tujuan");
    if (tujuan) {
      setTimeout(function () {
        window.location.href = tujuan;
      }, 1200);
    }
  });

  // tanda merah hilang begitu field diisi
  $("form").on("input change", ".is-invalid", function () {
    $(this).removeClass("is-invalid");
  });
});
