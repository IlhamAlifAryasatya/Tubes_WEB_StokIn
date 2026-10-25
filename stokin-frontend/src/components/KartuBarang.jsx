import { BATAS_MENIPIS, formatRupiah } from "../data/dataBarang";

function KartuBarang({ kode, nama, kategori, satuan, stok, harga, aktif, foto, onHapus }) {
  const menipis = aktif && stok < BATAS_MENIPIS;

  return (
    <div className="card h-100">
      <div className="card-body d-flex gap-3">
        {foto ? (
          <img src={foto} alt={nama} className="foto-barang rounded" />
        ) : (
          <div className="tanpa-foto rounded bg-body-secondary text-body-secondary d-flex align-items-center justify-content-center">
            Tanpa foto
          </div>
        )}

        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <h3 className="h6 mb-1">{nama}</h3>
            <span className={aktif ? "badge rounded-pill bg-success-subtle text-success-emphasis" : "badge rounded-pill bg-secondary-subtle text-secondary-emphasis"}>
              {aktif ? "Aktif" : "Nonaktif"}
            </span>
          </div>
          <p className="small text-body-secondary mb-2">{kode} · {kategori}</p>

          <p className="small mb-1">
            Stok: <strong>{stok} {satuan}</strong>
            {menipis && <span className="badge rounded-pill bg-danger-subtle text-danger-emphasis ms-2">Menipis</span>}
          </p>
          <p className="small mb-2">Harga: {formatRupiah(harga)}</p>

          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onHapus(kode)}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default KartuBarang;
