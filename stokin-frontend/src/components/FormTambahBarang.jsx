import { useState } from "react";
import { daftarKategori } from "../data/dataBarang";

const formKosong = { nama: "", kategori: "Sembako", satuan: "", stok: "", harga: "", aktif: "ya" };

function FormTambahBarang({ onTambah }) {
  const [form, setForm] = useState(formKosong);
  const [salah, setSalah] = useState(false);

  function ubahInput(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function simpan(event) {
    event.preventDefault();

    if (form.nama.trim() === "" || form.satuan.trim() === "" || form.stok === "" || form.harga === "") {
      setSalah(true);
      return;
    }

    onTambah({
      nama: form.nama.trim(),
      kategori: form.kategori,
      satuan: form.satuan.trim(),
      stok: Number(form.stok),
      harga: Number(form.harga),
      aktif: form.aktif === "ya",
      foto: "",
    });
    setForm(formKosong);
    setSalah(false);
  }

  return (
    <article id="tambah-barang" className="card">
      <div className="card-body">
        <h2 className="h5 mb-3">Tambah Barang</h2>

        {salah && (
          <p className="alert alert-danger py-2 small">Nama, satuan, stok, dan harga wajib diisi.</p>
        )}

        <form onSubmit={simpan}>
          <div className="mb-3">
            <label htmlFor="nama" className="form-label">Nama Barang</label>
            <input id="nama" name="nama" className="form-control" value={form.nama} onChange={ubahInput} placeholder="Contoh: Tepung Terigu 1 kg" />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label htmlFor="kategori" className="form-label">Kategori</label>
              <select id="kategori" name="kategori" className="form-select" value={form.kategori} onChange={ubahInput}>
                {daftarKategori.map((kategori) => (
                  <option key={kategori} value={kategori}>{kategori}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label htmlFor="satuan" className="form-label">Satuan</label>
              <input id="satuan" name="satuan" className="form-control" value={form.satuan} onChange={ubahInput} placeholder="Sak" />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label htmlFor="stok" className="form-label">Stok</label>
              <input id="stok" name="stok" type="number" min="0" className="form-control" value={form.stok} onChange={ubahInput} />
            </div>
            <div className="col-6">
              <label htmlFor="harga" className="form-label">Harga (Rp)</label>
              <input id="harga" name="harga" type="number" min="0" className="form-control" value={form.harga} onChange={ubahInput} />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="aktif" className="form-label">Status</label>
            <select id="aktif" name="aktif" className="form-select" value={form.aktif} onChange={ubahInput}>
              <option value="ya">Aktif</option>
              <option value="tidak">Nonaktif</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">Tambah</button>
        </form>
      </div>
    </article>
  );
}

export default FormTambahBarang;
