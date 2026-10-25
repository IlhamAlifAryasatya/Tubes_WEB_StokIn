function Header({ namaToko }) {
  return (
    <header className="navbar bg-white border-bottom">
      <div className="container">
        <span className="navbar-brand logo fw-bold">StokIn</span>
        <nav className="d-flex gap-3 small">
          <a href="#ringkasan" className="link-secondary text-decoration-none">Ringkasan</a>
          <a href="#tambah-barang" className="link-secondary text-decoration-none">Tambah Barang</a>
          <a href="#daftar-barang" className="link-secondary text-decoration-none">Daftar Barang</a>
        </nav>
        <span className="small text-body-secondary d-none d-md-inline">{namaToko}</span>
      </div>
    </header>
  );
}

export default Header;
