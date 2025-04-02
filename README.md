# NutriLens

NutriLens adalah aplikasi berbasis web untuk menelusuri dan menampilkan informasi produk makanan menggunakan data dari OpenFoodFacts API. Aplikasi ini mendukung pencarian berdasarkan barcode, kata kunci, dan kategori, serta memberikan visualisasi informasi nutrisi secara ringkas

## Fitur Utama

- **Pencarian Produk** berdasarkan barcode, kata kunci, atau kategori.
- **Detail Produk** yang menampilkan nama, gambar, nutri-grade, dan informasi nutrisi makro
- **Snapshot Testing** untuk memastikan kestabilan data dari API dan validasi field yang dibutuhkan
- **Integrasi langsung ke API** tanpa mock, termasuk validasi `fetch`, error handling, dan kontrak data

## Cara Menjalankan

1. **Gunakan `Makefile` untuk inisialisasi proyek:**

```bash
make
```

`Makefile` akan menjalankan langkah-langkah berikut:

- Membuat sertifikat SSL di folder `ssl/` untuk pengembangan lokal
- Menginstall semua dependencies menggunakan `npm install`
- Membuat file `.env` jika belum ada

### Target `Makefile` yang Tersedia

- `make` atau `make all`: Menjalankan semua tugas (generate SSL, install dependencies, konfigurasi environment)
- `make ssl`: Membuat sertifikat SSL di folder `ssl/`
- `make install`: Menginstall semua dependencies menggunakan `npm install`
- `make env`: Membuat file `.env` jika belum ada
- `make clean`: Menghapus file SSL yang dihasilkan

2. **Jalankan pengembangan lokal dengan SSL:**

```bash
npm run dev -- --host --port 8080
```

- **`--host`**: Mengexpose server ke jaringan lokal sehingga dapat diakses dari perangkat lain (misalnya, ponsel) menggunakan alamat IP lokal
- **`--port 8080`**: Menentukan port untuk server pengembangan

> **Catatan:** Sertifikat SSL yang dibuat oleh `Makefile` memungkinkan pengembangan lokal menggunakan HTTPS. Hal ini penting untuk menguji fitur seperti barcode scanning yang memerlukan koneksi aman (HTTPS) di browser modern

3. **Tes dengan Jest:**

```bash
npm test
```

atau gunakan test terpisah:

```bash
npm test:unit
npm test:integration
```

4. **Format kode & linting:**

```bash
npm format && npm lint
```

## Teknologi

- **Vite** - Modul bundler
- **Tailwind CSS v4** - Styling UI
- **Jest** - Testing framework (unit test, integration test, snapshot)
- **ESLint + Prettier** - Linting dan format otomatis
- **OpenFoodFacts API v2** - Sumber data produk
- **ZXing library** - Library Barcode Scanning

## API Endpoint yang Digunakan

- **OpenFoodFacts API**:

  - `GET https://world.openfoodfacts.org/api/v2/product/${barcode}`  
    Digunakan untuk mendapatkan informasi produk berdasarkan ID/barcode

  - `GET https://search.openfoodfacts.org/search?q=${query}&page_size=10&page=1`  
    Digunakan untuk search berdasarkan kata kunci

  - `GET https://world.openfoodfacts.org/api/v2/search?categories_tags=${category}&countries_tags_en=id&sort_by=scans_n&fields=code,product_name,nutrition_grades,image_front_small_url`  
    Digunakan untuk search produk berdasarkan kategori

## Snapshot & Testing

Semua fungsi `getProductByBarcode()` diuji secara langsung ke endpoint OpenFoodFacts. Tidak ada mock untuk `fetch` kecuali dalam simulasi error.

Pengujian mencakup:

- **Validasi kontrak data** berdasarkan produk "Nutella Ferrero - 1kg"
- **Snapshot data mentah** dari respons asli API
- **Snapshot subset informasi penting** seperti nama, nutrisi, dan skor
- **Error handling** jika API gagal

## Dokumentasi API

- [OpenFoodFacts API v2 Docs](https://openfoodfacts.github.io/openfoodfacts-server/api/)

## TODO

- [x] Implementasi scanner barcode
- [x] UI untuk hasil pencarian kategori
- [x] Halaman detail produk
- [ ] Fitur perbandingan produk (compare)
- [ ] Menyimpan history pencarian

## Lisensi

Proyek ini didistribusikan dengan lisensi MIT.
