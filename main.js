// Katalog Karya — kode latihan Tugas P10, Praktikum Pemrograman Visual (TB033109)
// Aplikasi ini terbuka, tetapi beberapa bagiannya bermasalah. Lacak dengan DevTools, lalu perbaiki.
const galeri = document.querySelector('#galeri');
const jumlah = document.querySelector('#jumlah');
const detail = document.querySelector('#detail');
const cari = document.querySelector('#cari');
const filterKategori = document.querySelector('#filterKategori');
 
function saring() {
  const kata = cari.value.trim();
  const kategori = filterKategori.value;
  return KARYA.filter((k) =>
    (kategori === 'semua' || k.kategori === kategori) &&
    k.judul.includes(kata));
}
 
function kartu(k) {
  const kolom = document.createElement('div');
  kolom.className = 'col-12 col-sm-6 col-lg-4';
  kolom.innerHTML = `
    <div class="card h-100 shadow-sm">
      <div class="card-body">
        <span class="badge text-bg-primary mb-2"></span>
        <h2 class="h5 card-title"></h2>
        <p class="card-text text-secondary small"></p>
        <button type="button" class="btn btn-outline-primary btn-sm" data-id="${k.id}">Detail</button>
      </div>
    </div>`;
  kolom.querySelector('.badge').textContent = k.kategori;
  kolom.querySelector('.card-title').textContent = k.judul;
  kolom.querySelector('.card-text').textContent = `${k.pembuat} · ${k.tahun}`;
  return kolom;
}
 
function tampil() {
  const hasil = saring();
  galeri.replaceChildren(...hasil.map(kartu));
  jumlah.textContent = `Menampilkan ${KARYA.length} dari ${KARYA.length} karya`;
}
 
function pasangDetail() {
  galeri.querySelectorAll('button[data-id]').forEach((tombol) => {
    tombol.addEventListener('click', () => {
      const k = KARYA.find((x) => x.id === Number(tombol.dataset.id));
      detail.hidden = false;
      detail.textContent = `${k.judul} — ${k.kategori}, dibuat oleh ${k.pembuat} (${k.tahun}).`;
    });
  });
}
 
tampil();
pasangDetail();
cari.addEventListener('input', tampil);
document.querySelector('#filter-kategori').addEventListener('change', tampil);
