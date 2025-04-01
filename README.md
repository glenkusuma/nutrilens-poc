# NutriLens

NutriLens adalah aplikasi berbasis web untuk menelusuri dan menampilkan informasi produk makanan menggunakan data dari OpenFoodFacts API. Aplikasi ini mendukung pencarian berdasarkan barcode, kata kunci, dan kategori, serta memberikan visualisasi informasi nutrisi secara ringkas.

## Fitur Utama

- **Pencarian Produk** berdasarkan barcode, kata kunci, atau kategori.
- **Detail Produk** yang menampilkan nama, gambar, nutri-grade, dan informasi nutrisi makro.
- **Snapshot Testing** untuk memastikan kestabilan data dari API dan validasi field yang dibutuhkan.
- **Integrasi langsung ke API** tanpa mock, termasuk validasi `fetch`, error handling, dan kontrak data.

## Struktur Proyek

```
.
├── index.html
├── public/
├── src/
│   ├── controller/       # [TODO] logika interaksi user & view
│   ├── view/             # [TODO] rendering komponen UI
│   ├── model/
│   │   └── ProductModel.js
│   ├── style.css
│   └── main.js
├── __mock__/             # Berisi data snapshot dari API (optional untuk dev/test)
├── __tests__/
│   ├── productModel.test.js
│   └── integration/
│       ├── productModel.integration.test.js
│       └── __snapshots__/
├── babel.config.js
├── eslint.config.js
├── jest.config.js
├── jest.setup.js
├── vite.config.js
├── prettier.config.js
├── package.json
└── README.md
```

## Cara Menjalankan

1. Install dependency:

```bash
pnpm install
```

2. Jalankan pengembangan:

```bash
pnpm dev
```

3. Tes dengan Jest:

```bash
pnpm test
```

Atau gunakan test terpisah:

```bash
pnpm test:unit
pnpm test:integration
```

4. Format kode:

```bash
pnpm format
```

## Teknologi

- **Vite** - Modul bundler
- **Tailwind CSS v4** - Styling UI
- **Jest** - Testing framework (unit test, integration test, snapshot)
- **ESLint + Prettier** - Linting dan format otomatis
- **OpenFoodFacts API v2** - Sumber data produk

## API Endpoint yang Digunakan

- **OpenFoodFacts API**:

  - `GET https://world.openfoodfacts.org/api/v2/product/${barcode}`  
    Digunakan untuk mendapatkan informasi produk berdasarkan ID/barcode

  - `GET https://search.openfoodfacts.org/search?q=${query}&page_size=10&page=1`  
    Digunakan untuk search berdasarkan kata kunci

  - `GET https://world.openfoodfacts.org/api/v2/search?categories_tags=${category}&countries_tags_en=id&sort_by=scans_n&fields=code,product_name,nutrition_grades,image_front_small_url`  
    Digunakan untuk search produk berdasarkan kategori

## Kontrak Data Produk

Berikut adalah field yang dianggap wajib tersedia dalam objek `product`:

- `product_name`: Nama produk pendek
- `product_name_en`: Nama produk lengkap (opsional)
- `code`: Barcode produk
- `quantity`: Ukuran bersih
- `nutriscore_grade`: Nilai NutriScore
- `ecoscore_grade`: Nilai EcoScore
- `nova_group`: Nilai NOVA score (pengolahan)
- `image_nutrition_url`: Gambar tabel nutrisi
- `image_packaging_url`: Gambar kemasan
- `image_url`: Gambar utama produk
- `ingredients_text`: Deskripsi/komposisi produk
- `nutriments.energy-kcal_100g`: Kalori per 100g
- `nutriments.fat_100g`: Lemak total
- `nutriments.saturated-fat_100g`: Lemak jenuh
- `nutriments.carbohydrates_100g`: Karbohidrat
- `nutriments.proteins_100g`: Protein
- `nutriments.sugars_100g`: Gula
- `nutriments.salt_100g`: Garam

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

- [ ] Implementasi scanner barcode
- [ ] UI untuk hasil pencarian kategori
- [ ] Halaman detail produk
- [ ] Fitur perbandingan produk (compare)
- [ ] Menyimpan history pencarian

## Lisensi

Proyek ini didistribusikan dengan lisensi MIT.
