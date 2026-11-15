/* StokIn - interaksi sisi client.
   Data barang diambil dan disimpan lewat API NestJS (/api/barang).
   Riwayat transaksi masih dummy di array dan kembali seperti semula
   setiap halaman dimuat ulang. */

const URL_API = "/api/barang";
const BATAS_MENIPIS = 10; // stok di bawah angka ini ditandai menipis

// diisi dari GET /api/barang saat halaman dibuka
let daftarBarang = [];

// ===== Data dummy riwayat transaksi =====

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

// ===== Request ke API =====

// kirim data JSON ke backend (POST, PATCH, DELETE)
function kirimKeApi(method, url, data) {
  return $.ajax({
    url: url,
    method: method,
    contentType: "application/json",
    data: data ? JSON.stringify(data) : undefined
  });
}

// pesan error dari NestJS bisa berupa teks atau array (hasil validasi DTO)
function pesanErrorApi(xhr) {
  if (xhr.responseJSON && xhr.responseJSON.message) {
    const pesan = xhr.responseJSON.message;
    return Array.isArray(pesan) ? pesan.join(", ") : pesan;
  }
  return "Server StokIn tidak bisa dihubungi.";
}

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
  // halaman tanpa #pesan (dashboard, katalog, detail) dibuatkan kotak pesan di atas isi halaman
  if ($("#pesan").length === 0) {
    $("main article").children().first().after('<div id="pesan" class="alert small py-2 tersembunyi" role="alert"></div>');
  }

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
    // barang baru dari form tambah belum punya foto
    let foto = "";
    if (barang.foto) {
      foto = `<img src="../../assets/img/${barang.foto}" alt="${barang.alt}" width="40" height="40" class="rounded-3 object-fit-cover me-2 d-none d-md-inline">`;
    }

    const baris = `<tr>
      <td class="d-none d-md-table-cell">${barang.kode}</td>
      <td>
        ${foto}
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

// kode barang diambil dari alamat, misalnya detail.html?kode=BRG-003
function kodeDariAlamat() {
  return new URLSearchParams(window.location.search).get("kode") || "BRG-001";
}

function tampilkanDetail(barang) {
  document.title = barang.nama + " - StokIn";
  $("#detail-nama").text(barang.nama);
  if (barang.foto) {
    $("#detail-foto").attr({ src: "../../assets/img/" + barang.foto, alt: barang.alt });
  } else {
    $("#detail-foto").parent().html('<div class="rounded-3 bg-body-secondary text-body-secondary d-flex align-items-center justify-content-center">Belum ada foto</div>');
  }
  $("#detail-kode").text(barang.kode);
  $("#detail-kategori").text(barang.kategori);
  $("#detail-satuan").text(barang.satuan);
  $("#detail-stok").text(barang.stok + " " + barang.satuan);
  $("#detail-harga").text(formatRupiah(barang.harga));
  $("#detail-status").html(badgeStatus(barang));
  $("#tombol-ubah").attr("href", "ubah.html?kode=" + barang.kode);
}

function isiFormUbah(barang) {
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

  // barang yang sudah dihapus tetap tampil di riwayat dengan kodenya saja
  function namaBarang(kode) {
    const barang = cariBarang(kode);
    return barang ? barang.nama : kode;
  }
  function satuanBarang(kode) {
    const barang = cariBarang(kode);
    return barang ? barang.satuan : "";
  }

  if (jenis === "masuk") {
    for (const data of riwayatMasuk) {
      baris += `<tr>
        <td>${formatTanggal(data.tanggal)}</td>
        <td>${namaBarang(data.kode)}</td>
        <td>${data.jumlah} ${satuanBarang(data.kode)}</td>
        <td>${formatRupiah(data.hargaBeli)}</td>
        <td class="d-none d-md-table-cell">${data.keterangan}</td>
      </tr>`;
    }
  } else if (jenis === "keluar") {
    for (const data of riwayatKeluar) {
      baris += `<tr>
        <td>${formatTanggal(data.tanggal)}</td>
        <td>${namaBarang(data.kode)}</td>
        <td>${data.jumlah} ${satuanBarang(data.kode)}</td>
        <td>${data.alasan}</td>
        <td class="d-none d-md-table-cell">${data.penerima}</td>
      </tr>`;
    }
  } else {
    for (const data of riwayatRetur) {
      baris += `<tr>
        <td>${formatTanggal(data.tanggal)}</td>
        <td>${data.jenis}</td>
        <td>${namaBarang(data.kode)}</td>
        <td>${data.jumlah} ${satuanBarang(data.kode)}</td>
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
  // dashboard, katalog, dan transaksi butuh semua data barang
  if ($("#tabel-menipis, #tabel-aktif, #form-transaksi").length > 0) {
    $.getJSON(URL_API)
      .done(function (data) {
        daftarBarang = data;
        mulaiHalaman();
      })
      .fail(function (xhr) {
        tampilkanPesan("danger", pesanErrorApi(xhr));
      });
  }

  // detail dan ubah cukup mengambil satu barang
  if ($("#detail-nama, #form-ubah").length > 0) {
    $.getJSON(URL_API + "/" + kodeDariAlamat())
      .done(function (barang) {
        if ($("#detail-nama").length > 0) {
          tampilkanDetail(barang);
        } else {
          isiFormUbah(barang);
        }
      })
      .fail(function (xhr) {
        tampilkanPesan("danger", pesanErrorApi(xhr));
        $("#form-ubah button[type=submit], #tombol-ubah, #tombol-hapus").addClass("disabled").prop("disabled", true);
      });
  }

  // hapus barang dari halaman detail
  $("#tombol-hapus").on("click", function () {
    const kode = $("#detail-kode").text();
    if (!confirm(`Hapus ${$("#detail-nama").text()} (${kode})?`)) {
      return;
    }

    kirimKeApi("DELETE", URL_API + "/" + kode)
      .done(function (barang) {
        window.location.href = "katalog.html?dihapus=" + encodeURIComponent(barang.nama);
      })
      .fail(function (xhr) {
        tampilkanPesan("danger", pesanErrorApi(xhr));
      });
  });

  // tambah barang
  $("#form-tambah").on("submit", function (e) {
    e.preventDefault();
    const form = this;
    const kosong = cekFieldKosong($(this));
    if (kosong.length > 0) {
      tampilkanPesan("danger", "Lengkapi dulu: " + kosong.join(", ") + ".");
      return;
    }

    const barangBaru = {
      kode: $("#kode").val().trim().toUpperCase(),
      nama: $("#nama").val().trim(),
      kategori: $("#kategori option:selected").text(),
      satuan: $("#satuan option:selected").text(),
      stok: Number($("#stok").val()),
      harga: Number($("#harga").val()),
      catatan: $("#catatan").val().trim()
    };

    // kode dobel, nama dobel, dan format data dicek oleh backend
    kirimKeApi("POST", URL_API, barangBaru)
      .done(function (hasil) {
        tampilkanPesan("success", `${hasil.nama} (${hasil.kode}) ditambahkan ke katalog.`);
        form.reset();
      })
      .fail(function (xhr) {
        tampilkanPesan("danger", pesanErrorApi(xhr));
      });
  });

  // ubah barang
  $("#form-ubah").on("submit", function (e) {
    e.preventDefault();
    const kosong = cekFieldKosong($(this));
    if (kosong.length > 0) {
      tampilkanPesan("danger", "Lengkapi dulu: " + kosong.join(", ") + ".");
      return;
    }

    const perubahan = {
      nama: $("#nama").val().trim(),
      kategori: $("#kategori option:selected").text(),
      satuan: $("#satuan option:selected").text(),
      harga: Number($("#harga").val()),
      catatan: $("#catatan").val().trim(),
      aktif: $("#status").val() === "aktif"
    };

    kirimKeApi("PATCH", URL_API + "/" + $("#kode").val(), perubahan)
      .done(function (barang) {
        tampilkanPesan("success", `Perubahan ${barang.nama} disimpan.`);
      })
      .fail(function (xhr) {
        tampilkanPesan("danger", pesanErrorApi(xhr));
      });
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

// dijalankan setelah data barang dari API diterima
function mulaiHalaman() {
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

    // setelah hapus barang di halaman detail
    if (alamat.get("dihapus")) {
      tampilkanPesan("success", `${alamat.get("dihapus")} dihapus dari katalog.`);
    }

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
}
