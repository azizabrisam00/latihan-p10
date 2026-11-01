# Laporan Investigasi Bug Katalog Karya

## Status Checkout

Laporan ini merangkum investigasi dan perubahan G1–G6 dari sesi kerja. Saat laporan dibuat, checkout aktif berada di branch `master` dengan working tree bersih dan riwayat Git hanya berisi `chore: commit awal kode latihan asli`. Perubahan yang dirangkum di bawah belum ada pada checkout aktif dan belum memiliki pesan commit perbaikan yang bisa dicocokkan. Bukti sebelum perbaikan diperiksa kembali pada checkout ini; validasi pascaperbaikan yang disebutkan berasal dari saat perubahan sesi diterapkan.

## G1 — Logo Hilang

**Langkah Reproduksi**

1. Buka `index.html` dan amati logo di navbar.
2. Di DevTools, buka Network lalu muat ulang halaman.
3. Periksa request gambar logo.

**Hipotesis**

Dugaan awal: browser gagal menampilkan SVG karena format atau isi file rusak. Dugaan ini tidak cocok dengan pemeriksaan aset: file `assets/logo.svg` tersedia dan berhasil dimuat ketika path diarahkan ke sana. Penyebab sebenarnya adalah URL relatif mengarah ke `img/logo.svg`, folder yang tidak berisi file logo.

**Bukti DevTools**

Pada checkout awal, request `file:///.../img/logo.svg` gagal (`net::ERR_UNEXPECTED`). Setelah path diarahkan ke `assets/logo.svg`, request gambar dan stylesheet serta skrip lokal memperoleh status `200`, tanpa request gagal.

**Perbaikan (berkas:baris)**

`index.html:13` — ubah `src="img/logo.svg"` menjadi `src="assets/logo.svg"`.

**Uji Ulang**

Validasi setelah perbaikan menunjukkan request `assets/logo.svg` berstatus `200`. Saat ini checkout kembali memakai path lama, sehingga pemeriksaan ulang pada checkout aktif akan gagal sampai perbaikannya diterapkan kembali.

## G2 — Tata Letak Kartu 1 Kolom

**Langkah Reproduksi**

1. Buka halaman katalog pada lebar desktop.
2. Periksa elemen `#galeri` dan kolom kartu di Elements.

**Hipotesis**

Dugaan awal: kelas kolom pada kartu tidak mengatur breakpoint dengan benar. Dugaan ini gugur setelah struktur kartu diperiksa: kartu sudah memakai kelas `col-12 col-sm-6 col-lg-4`, tetapi elemen induk galeri belum memakai kelas Bootstrap `row` sebagai pembungkus grid.

**Bukti DevTools**

Elements menunjukkan `#galeri` hanya memiliki kelas `g-3`, sementara elemen anak kartu memakai kelas `col-*`. Tanpa `.row` pada induk, gutter dan perilaku grid Bootstrap tidak diterapkan sebagaimana dimaksud.

**Perbaikan (berkas:baris)**

`index.html:34` — ubah kelas galeri dari `g-3` menjadi `row g-3`.

**Uji Ulang**

Markup setelah perbaikan diperiksa dan menunjukkan `class="row g-3"` pada `#galeri`. Checkout aktif sekarang kembali menunjukkan `class="g-3"`.

## G3 — Filter Kategori Error

**Langkah Reproduksi**

1. Buka halaman dan periksa Console.
2. Pilih kategori `Video`.

**Hipotesis**

Dugaan awal: nilai kategori `Video` tidak cocok dengan data atau event `change` dari elemen select tidak bekerja. Hipotesis ini gugur: opsi dan data sama-sama menggunakan nilai `Video`, elemen `#filterKategori` ada, sedangkan `document.querySelector('#filter-kategori')` menghasilkan `null`. Kegagalan sebenarnya adalah selector memakai ID yang berbeda dari HTML.

**Bukti DevTools**

Console menampilkan `TypeError: Cannot read properties of null (reading 'addEventListener')` di `main.js:54`. Pemeriksaan selector menghasilkan `#filter-kategori` tidak ditemukan dan `#filterKategori` ditemukan. Error terjadi saat listener dipasang, bukan saat kategori dibandingkan.

**Perbaikan (berkas:baris)**

`main.js:54` — ubah selector menjadi `document.querySelector('#filterKategori')`.

**Uji Ulang**

Setelah perbaikan, selector JavaScript diperiksa cocok dengan ID HTML. Checkout aktif saat ini kembali memakai selector lama dan mereproduksi TypeError tersebut.

## G4 — Teks Jumlah Karya Tidak Berubah

**Langkah Reproduksi**

1. Ketik `Video` pada kolom pencarian.
2. Bandingkan jumlah kartu yang tampil dengan teks jumlah di atas galeri.

**Hipotesis**

Dugaan awal: fungsi pencarian tidak menyaring data. Dugaan ini gugur karena galeri berubah menjadi dua kartu, tetapi teks jumlah tetap `Menampilkan 6 dari 6 karya`. Yang statis adalah nilai penghitung pertama, bukan hasil saringannya.

**Bukti DevTools**

Pada checkout awal, DOM berisi dua tombol kartu setelah pencarian `Video`, sedangkan `#jumlah` masih berisi `Menampilkan 6 dari 6 karya`.

**Perbaikan (berkas:baris)**

`main.js:38` — gunakan `hasil.length` untuk jumlah hasil dan pertahankan `KARYA.length` sebagai total karya.

**Uji Ulang**

Baris setelah perbaikan diperiksa menggunakan `hasil.length`. Saat ini checkout kembali memakai `KARYA.length` untuk kedua angka; hasil yang diharapkan untuk pencarian `Video` adalah `Menampilkan 2 dari 6 karya`.

## G5 — Tombol Detail Mati Setelah Pencarian

**Langkah Reproduksi**

1. Ketik `Video` agar galeri dirender ulang.
2. Klik tombol `Detail` pada salah satu hasil.

**Hipotesis**

Dugaan awal: pencarian mengembalikan objek karya yang tidak memiliki ID sehingga handler tidak dapat menemukan detailnya. Dugaan ini gugur: tombol hasil masih memiliki `data-id`; penyebabnya adalah `replaceChildren()` membuang tombol lama beserta listener-nya, sementara `pasangDetail()` hanya dipanggil pada render awal.

**Bukti DevTools**

Pada checkout awal, setelah pencarian `Video` terdapat dua tombol baru di DOM. Klik tombol tidak menampilkan elemen `#detail`; listener hanya pernah dipasang pada tombol yang sudah diganti.

**Perbaikan (berkas:baris)**

`main.js:39` — panggil `pasangDetail()` di akhir `tampil()`, setelah kartu baru dirender. Hapus pemanggilan terpisah setelah pemanggilan awal `tampil()` agar listener tidak dipasang dua kali.

**Uji Ulang**

Pemeriksaan diagnostik setelah perbaikan tidak menemukan error pada `main.js`. Uji klik pascapencarian pada checkout aktif masih gagal karena checkout tersebut kembali ke kode awal; hasil yang diharapkan setelah perbaikan adalah detail karya tampil.

## G6 — Pencarian Case-Sensitive

**Langkah Reproduksi**

1. Ketik `Video` pada pencarian dan catat hasil.
2. Ubah menjadi `video` huruf kecil.

**Hipotesis**

Dugaan awal: data kategori atau judul tidak terbaca. Dugaan ini gugur karena pencarian dengan kapitalisasi yang sama seperti judul menghasilkan dua kartu, sedangkan pencarian huruf kecil menghasilkan nol kartu. Penyaringan berjalan, tetapi `includes()` membandingkan huruf secara peka kapitalisasi.

**Bukti DevTools**

Checkout awal menghasilkan dua kartu untuk `Video` dan nol untuk `video`. Judul pada data menggunakan huruf kapital di awal kata.

**Perbaikan (berkas:baris)**

`main.js:14` — bandingkan `k.judul.toLowerCase().includes(kata.toLowerCase())`.

**Uji Ulang**

Pemeriksaan diagnostik setelah perbaikan tidak menemukan error pada `main.js`. Pada checkout aktif, pencarian `video` masih menghasilkan nol kartu; setelah perbaikan diterapkan, `video` dan `Video` seharusnya menghasilkan dua karya yang sama.
