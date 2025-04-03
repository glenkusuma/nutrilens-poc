// filepath: ./src/controller/ProductController.js
import { ProductModel } from '../model/ProductModel.js';

export class ProductController {
  constructor(view) {
    this.view = view;
    this.model = new ProductModel();
  }

  async showProductDetail(barcode) {
    try {
      this.view.renderProductCardSkeleton();

      const data = await this.model.getProductByBarcode(barcode);
      this.view.renderProductCard(data.product);
    } catch (err) {
      this.view.renderError(err.message);
    }
  }

  async searchByQuery(query) {
    try {
      const data = await this.model.searchByQuery(query, 10, 1);
      if (data.hits && data.hits.length > 0) {
        this.view.renderSearchResults(data.hits);
      } else {
        this.view.renderError(
          `Produk tidak ditemukan untuk kata kunci '${query}'.`
        );
      }
    } catch (err) {
      this.view.renderError(err.message);
    }
  }

  async searchByCategory(category) {
    try {
      const data = await this.model.getByCategory(category, 10);
      const products = data.products || [];
      if (products.length > 0) {
        this.view.renderSearchResults(products);
      } else {
        this.view.renderError(
          `Produk tidak ditemukan untuk kategori '${category}'.`
        );
      }
    } catch (err) {
      this.view.renderError(err.message);
    }
  }
}
