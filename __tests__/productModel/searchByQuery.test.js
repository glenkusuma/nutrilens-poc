// __tests__/productModel/searchByQuery.test.js
import { ProductModel } from '../../src/model/ProductModel.js';
import sampleSearchNutella from '../../__mock__/sampleSearchNutella.json';

// fungsi helper untuk validasi setiap hit
const validateSearchHit = (hit) => {
    // field wajib
    expect(hit).toHaveProperty('code');
    expect(typeof hit.code).toBe('string');
    expect(hit.code.length === 8 || hit.code.length === 13).toBe(true);

    expect(hit).toHaveProperty('product_name');
    if (hit.hasOwnProperty('product_name')) {
        expect(typeof hit.product_name).toBe('string');
    } else {
        expect(hit.product_name).toBeUndefined();
    }

    expect(hit).toHaveProperty('brands');
    expect(Array.isArray(hit.brands)).toBe(true);

    if (hit.hasOwnProperty('nutrition_grades')) {
        expect(typeof hit.nutrition_grades).toBe('string');
    } else {
        expect(hit.nutrition_grades).toBeUndefined();
    }

    if (hit.hasOwnProperty('image_front_small_url')) {
        expect(typeof hit.image_front_small_url).toBe('string');
    } else {
        expect(hit.image_front_small_url).toBeUndefined();
    }
};

describe('[UNIT] ProductModel.searchByQuery', () => {
  let model;

  beforeEach(() => {
    model = new ProductModel();
  });

  it('should return valid search results for keyword "nutella"', async () => {
    // mock global fetch untuk mengembalikan data sampleSearchNutella
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleSearchNutella,
    });

    const response = await model.searchByQuery('nutella');
    // meriksa bahwa respons memiliki property "hits" berupa array
    expect(response).toHaveProperty('hits');
    expect(Array.isArray(response.hits)).toBe(true);
    expect(response.hits.length).toBeGreaterThan(0);

    // validasi tiap produk pada hits
    response.hits.forEach((hit) => {
      validateSearchHit(hit);
    });
  });

  it('should return empty hits array for a non-existing keyword', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ hits: [] }),
    });

    const response = await model.searchByQuery('nonexistentkeyword123');
    expect(response).toHaveProperty('hits');
    expect(Array.isArray(response.hits)).toBe(true);
    expect(response.hits.length).toBe(0);
  });

  it('should throw error when fetch fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(model.searchByQuery('nutella')).rejects.toThrow(
      'Gagal mencari produk'
    );
  });
});
