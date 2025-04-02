// __tests__/integration/productModel/searchByQuery.test.js
import { ProductModel } from '../../../src/model/ProductModel.js';

const validateSearchHit = (hit) => {
  // field wajib: code
  expect(hit).toHaveProperty('code');
  expect(typeof hit.code).toBe('string');
  expect(hit.code.length === 8 || hit.code.length === 13).toBe(true);

  // field: product_name (jika ada)
  expect(hit).toHaveProperty('product_name');
  if (hit.product_name !== undefined) {
    expect(typeof hit.product_name).toBe('string');
  } else {
    expect(hit.product_name).toBeUndefined();
  }

  // field: brands
  expect(hit).toHaveProperty('brands');
  expect(Array.isArray(hit.brands)).toBe(true);

  // field: nutrition_grades (jika ada)
  if (hit.hasOwnProperty('nutrition_grades')) {
    expect(typeof hit.nutrition_grades).toBe('string');
  } else {
    expect(hit.nutrition_grades).toBeUndefined();
  }

  // field: image_front_small_url (jika ada)
  if (hit.hasOwnProperty('image_front_small_url')) {
    expect(typeof hit.image_front_small_url).toBe('string');
  } else {
    expect(hit.image_front_small_url).toBeUndefined();
  }
};

describe('[INTEGRATION] ProductModel.searchByQuery', () => {
  let model;

  beforeAll(() => {
    model = new ProductModel();
  });

  it('should return valid search results for keyword "nutella"', async () => {
    // panggil API nyata (menggunakan proxy CORS jika diperlukan)
    const response = await model.searchByQuery('nutella');
    // meriksa bahwa response memiliki properti "hits" berupa array
    expect(response).toHaveProperty('hits');
    expect(Array.isArray(response.hits)).toBe(true);
    expect(response.hits.length).toBeGreaterThan(0);

    // validasi tiap produk di hits
    response.hits.forEach((hit) => {
      validateSearchHit(hit);
    });
  });

  it('should return empty hits array for a non-existing keyword', async () => {
    const response = await model.searchByQuery('nonexistentkeyword123');
    expect(response).toHaveProperty('hits');
    expect(Array.isArray(response.hits)).toBe(true);
    expect(response.hits.length).toBe(0);
  });

  it('should throw error when API returns non-OK status', async () => {
    // simulasi error, override sementara global.fetch
    const originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(model.searchByQuery('nutella')).rejects.toThrow('Gagal mencari produk');

    // kembalikan fetch ke aslinya
    global.fetch = originalFetch;
  });
});
