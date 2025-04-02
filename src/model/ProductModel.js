export class ProductModel {
  baseUrl = 'https://id.openfoodfacts.org/api/v2/';

  async getProductByBarcode(barcode) {
    const res = await fetch(`${this.baseUrl}/product/${barcode}`);
    if (!res.ok) throw new Error('Gagal mengambil produk');
    return await res.json();
  }

  async searchByQuery(query, size = 10, page = 1) {
    const url = `https://search.openfoodfacts.org/search?q=${encodeURIComponent(query)}&page_size=${size}&page=${page}`;
    const res = await fetch(`https://cors-anywhere.sawala.dev/${url}`);
    if (!res.ok) throw new Error('Gagal mencari produk');
    return await res.json();
  }

  async getByCategory(keyword, size = 10) {
    const url = `${this.baseUrl}/search?categories_tags=${encodeURIComponent(keyword)}&countries_tags_en=id&sort_by=scans_n&page_size=${size}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gagal mengambil kategori');
    return await res.json();
  }
}
