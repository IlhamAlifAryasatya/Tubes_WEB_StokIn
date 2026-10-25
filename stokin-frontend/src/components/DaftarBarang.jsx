import KartuBarang from "./KartuBarang";

function DaftarBarang({ daftarBarang, onHapus }) {
  return (
    <article id="daftar-barang">
      <h2 className="h5 mb-3">Daftar Barang ({daftarBarang.length})</h2>

      {daftarBarang.length === 0 ? (
        <p className="card card-body text-center text-body-secondary">Belum ada data barang</p>
      ) : (
        <div className="row g-3">
          {daftarBarang.map((barang) => (
            <div className="col-md-6" key={barang.kode}>
              <KartuBarang {...barang} onHapus={onHapus} />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default DaftarBarang;
