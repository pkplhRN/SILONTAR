# Perbaikan Deployment SILONTAR di GitHub Pages

## Penyebab tampilan sebelumnya salah

GitHub Pages menampilkan `README.md` karena `index.html` SILONTAR berada di dalam folder `site/`, sedangkan sumber publikasi dipilih dari root repository. Paket ini sudah diperbaiki: `index.html` sekarang berada langsung di root.

## Berkas yang wajib berada di root repository

```text
index.html
config.js
404.html
.nojekyll
assets/
  logo-pemkab-rote-ndao.png
```

Jangan memasukkan seluruh berkas tersebut ke dalam folder `site`, `public`, atau folder paket lain.

## Langkah mengganti repository yang sudah ada

1. Buka repository GitHub `SILONTAR`.
2. Hapus folder `site/` lama dan workflow `.github/workflows/deploy-pages.yml` bila masih ada.
3. File `README.md` lama boleh dihapus atau dibiarkan; `index.html` akan menjadi halaman utama.
4. Ekstrak ZIP perbaikan ini di komputer.
5. Masuk ke folder hasil ekstrak, lalu unggah **isi foldernya**, bukan folder pembungkusnya.
6. Pastikan `index.html` terlihat sejajar dengan `config.js` pada halaman utama repository.
7. Buka **Settings → Pages**.
8. Pada **Build and deployment**, pilih **Source: Deploy from a branch**.
9. Pilih branch **main** dan folder **/(root)**, lalu klik **Save**.
10. Tunggu proses publikasi selesai, kemudian buka:

```text
https://pkplhrn.github.io/SILONTAR/
```

11. Tekan `Ctrl + F5` atau buka melalui mode samaran.

## Konfigurasi Apps Script

`config.js` telah menggunakan URL Web App SILONTAR yang berakhiran `/exec`. Jika URL deployment berubah, ganti hanya nilai `webAppUrl`.

Pada proyek Apps Script, pastikan:

- deployment menggunakan **Execute as: Me**;
- akses menggunakan **Anyone**;
- `doGet()` memakai `XFrameOptionsMode.ALLOWALL`;
- `JavaScript.html` dan `Stylesheet.html` versi kompatibel embed sudah dipasang;
- setelah perubahan dibuat deployment **New version**.

## Pemeriksaan cepat

Deployment sudah benar bila repository menampilkan struktur berikut pada root:

```text
SILONTAR/
├── index.html
├── config.js
├── 404.html
├── .nojekyll
└── assets/
```

Jika halaman masih menampilkan panduan Markdown, berarti `index.html` belum berada di root atau GitHub Pages masih memakai sumber deployment lama.
