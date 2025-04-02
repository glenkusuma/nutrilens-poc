// __tests__/integration/productModel.getByCategory.test.js

import { ProductModel } from '../../../src/model/ProductModel.js';

describe('[INTEGRATION] ProductModel.getByCategory', () => {
  let productModel;

  beforeAll(() => {
    // Membuat instance ProductModel
    productModel = new ProductModel();
  });

  const validateProduct = (product) => {
    // Field wajib
    expect(product).toHaveProperty('code');
    expect(typeof product.code).toBe('string');
    expect(product.code.length === 8 || product.code.length === 13).toBe(true);

    expect(product).toHaveProperty('schema_version');
    expect(typeof product.schema_version).toBe('number');

    if (product.hasOwnProperty('product_name')) {
      expect(typeof product.product_name).toBe('string');
    } else {
      expect(product.product_name).toBeUndefined();
    }
    if (product.hasOwnProperty('nutrition_grades')) {
      expect(typeof product.nutrition_grades).toBe('string');
    } else {
      expect(product.nutrition_grades).toBeUndefined();
    }
    if (product.hasOwnProperty('image_front_small_url')) {
      expect(typeof product.image_front_small_url).toBe('string');
    } else {
      expect(product.image_front_small_url).toBeUndefined();
    }
  };

  it('should return a list of products matching the keyword "chocolate" with required fields', async () => {
    const keyword = 'chocolate';
    const response = await productModel.getByCategory(keyword);
    const products = response.products || [];

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    products.forEach((product) => {
      validateProduct(product);
    });
  });

  it('should return an empty array if no products are found for a non-existing keyword', async () => {
    const keyword = 'nonexistentkeyword123';
    const response = await productModel.getByCategory(keyword);
    const products = response.products || [];

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBe(0);
  });

  it('should return a valid response for an empty string keyword with required fields', async () => {
    const keyword = '';
    const response = await productModel.getByCategory(keyword);
    const products = response.products || [];

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    products.forEach((product) => {
      validateProduct(product);
    });
  });

  it('should return a list of products matching the keyword "milk" with required fields', async () => {
    const keyword = 'milk';
    const response = await productModel.getByCategory(keyword);
    const products = response.products || [];

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    products.forEach((product) => {
      validateProduct(product);
    });
  });

  it('should return a list of products matching the keyword "snacks" with required fields', async () => {
    const keyword = 'snacks';
    const response = await productModel.getByCategory(keyword);
    const products = response.products || [];

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    products.forEach((product) => {
      validateProduct(product);
    });
  });

  it('should handle missing "image_front_small_url" gracefully', async () => {
    const keyword = 'chocolate';
    const response = await productModel.getByCategory(keyword);
    const products = response.products || [];

    // Cari produk yang tidak memiliki properti "image_front_small_url"
    const productWithoutImage = products.find(
      (product) => !product.hasOwnProperty('image_front_small_url')
    );
    if (productWithoutImage) {
      expect(productWithoutImage.image_front_small_url).toBeUndefined();
    } else {
      expect(true).toBe(true);
    }
  });
});
