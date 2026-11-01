import { useState } from "react";
import Header from "./components/Header";
import RingkasanStok from "./components/RingkasanStok";
import FormTambahBarang from "./components/FormTambahBarang";
import DaftarBarang from "./components/DaftarBarang";
import ProdukPemasok from "./components/ProdukPemasok";
import Footer from "./components/Footer";
import dataBarang from "./data/dataBarang";

function App() {
  const [daftarBarang, setDaftarBarang] = useState(dataBarang);

  function tambahBarang(barangBaru) {
    let nomorTerakhir = 0;
    daftarBarang.forEach((barang) => {
      nomorTerakhir = Math.max(nomorTerakhir, Number(barang.kode.slice(4)));
    });
    const kode = "BRG-" + String(nomorTerakhir + 1).padStart(3, "0");

    setDaftarBarang([...daftarBarang, { ...barangBaru, kode }]);
  }

  function hapusBarang(kode) {
    setDaftarBarang(daftarBarang.filter((barang) => barang.kode !== kode));
  }

  return (
    <>
      <Header namaToko="Toko Sembako Jaya" />

      <main className="container py-4">
        <RingkasanStok daftarBarang={daftarBarang} />

        <div className="row g-4 mt-1">
          <div className="col-lg-4">
            <FormTambahBarang onTambah={tambahBarang} />
          </div>
          <div className="col-lg-8">
            <DaftarBarang daftarBarang={daftarBarang} onHapus={hapusBarang} />
          </div>
        </div>

        <ProdukPemasok />
      </main>

      <Footer />
    </>
  );
}

export default App;
