import { BATAS_MENIPIS, formatRupiah } from "../data/dataBarang";

function RingkasanStok({ daftarBarang }) {
  const barangAktif = daftarBarang.filter((barang) => barang.aktif);
  const jumlahNonaktif = daftarBarang.length - barangAktif.length;
  const jumlahMenipis = barangAktif.filter((barang) => barang.stok < BATAS_MENIPIS).length;

  let totalNilai = 0;
  barangAktif.forEach((barang) => {
    totalNilai += barang.stok * barang.harga;
  });

  const ringkasan = [
    { judul: "Barang Aktif", nilai: barangAktif.length + " jenis" },
    { judul: "Barang Nonaktif", nilai: jumlahNonaktif + " jenis" },
    { judul: "Total Nilai Stok", nilai: formatRupiah(totalNilai) },
    { judul: "Stok Menipis", nilai: jumlahMenipis + " barang" },
  ];

  return (
    <section id="ringkasan" className="row g-3">
      {ringkasan.map((item, urutan) => (
        <div className={(urutan % 2 === 0 ? "col-7" : "col-5") + " col-sm-6 col-lg-3"} key={item.judul}>
          <div className="card h-100">
            <div className="card-body">
              <p className="small text-body-secondary mb-1">{item.judul}</p>
              <p className="fs-5 fw-bold mb-0">{item.nilai}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default RingkasanStok;
