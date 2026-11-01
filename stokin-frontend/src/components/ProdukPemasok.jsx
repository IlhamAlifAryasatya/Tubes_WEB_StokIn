import { useEffect, useState } from "react";

const URL_PRODUK = "https://dummyjson.com/products/category/groceries?limit=8&select=title,price,stock,thumbnail";

function ProdukPemasok() {
  const [produk, setProduk] = useState([]);
  const [status, setStatus] = useState("loading");
  const [percobaan, setPercobaan] = useState(0);

  useEffect(() => {
    async function ambilProduk() {
      try {
        const respons = await fetch(URL_PRODUK);
        if (!respons.ok) {
          throw new Error("Status " + respons.status);
        }
        const data = await respons.json();
        setProduk(data.products);
        setStatus("berhasil");
      } catch {
        setStatus("gagal");
      }
    }

    ambilProduk();
  }, [percobaan]);

  function cobaLagi() {
    setStatus("loading");
    setPercobaan(percobaan + 1);
  }

  return (
    <article id="produk-pemasok" className="mt-4">
      <h2 className="h5 mb-3">Produk dari Pemasok</h2>

      {status === "loading" && (
        <div className="card card-body d-flex flex-row align-items-center gap-2 text-body-secondary">
          <span className="spinner-border spinner-border-sm" role="status"></span>
          Memuat produk pemasok...
        </div>
      )}

      {status === "gagal" && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center gap-2 mb-0">
          <span>Produk pemasok gagal dimuat. Periksa koneksi internet.</span>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={cobaLagi}>
            Coba Lagi
          </button>
        </div>
      )}

      {status === "berhasil" && (
        <div className="row g-3">
          {produk.map((item) => (
            <div className="col-6 col-md-4 col-lg-3" key={item.id}>
              <div className="card h-100">
                <img src={item.thumbnail} alt={item.title} className="card-img-top foto-pemasok" />
                <div className="card-body p-3">
                  <h3 className="h6 mb-1">{item.title}</h3>
                  <p className="small text-body-secondary mb-0">Stok pemasok: {item.stock}</p>
                  <p className="small mb-0">Harga: US${item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default ProdukPemasok;
