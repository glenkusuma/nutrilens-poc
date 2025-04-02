import { ProductModel } from '../../../src/model/ProductModel.js';

const requiredFields = {
  'product.product_name': 'Nama produk',
  'product.product_name_en': 'Nama full',
  'product.code': 'Barcode',
  'product.quantity': 'Netsize',
  'product.nutriscore_grade': 'NutriScore',
  'product.ecoscore_grade': 'EcoScore',
  'product.nova_group': 'NovaScore',
  'product.image_nutrition_url': 'Gambar NutriScore',
  'product.image_packaging_url': 'Gambar EcoScore',
  'product.image_url': 'Gambar NovaScore',
  'product.ingredients_text': 'Deskripsi Produk',
  'product.nutriments.energy-kcal_100g': 'Kalori',
  'product.nutriments.fat_100g': 'Total Fat',
  'product.nutriments.saturated-fat_100g': 'Saturated Fat',
  'product.nutriments.carbohydrates_100g': 'Karbohidrat',
  'product.nutriments.proteins_100g': 'Protein',
  'product.nutriments.sugars_100g': 'Gula',
  'product.nutriments.salt_100g': 'Garam',
};

describe('[INTEGRATION] ProductModel.getProductByBarcode API', () => {
  let model;

  beforeAll(() => {
    model = new ProductModel();
  });

  test('should fetch Nutella Ferrero product and validate required fields', async () => {
    const data = await model.getProductByBarcode('3017620422003'); // Nutella Ferrero
    expect(data.status).toBe(1);

    for (const [key, label] of Object.entries(requiredFields)) {
      const value = key
        .split('.')
        .reduce((acc, part) => acc && acc[part], data);
      expect(value).toBeDefined();
    }
  });

  test('snapshot of Nutella Ferrero full product data', async () => {
    const data = await model.getProductByBarcode('3017620422003');
    expect(data).toMatchSnapshot();
  });

  test('should return product even if nutriments are missing', async () => {
    const data = await model.getProductByBarcode('0000000000000');
    expect(data.status).toBe(1);
    expect(data.product).toHaveProperty('product_name');
    expect(data.product.nutriments).toBeDefined();
  });

  test('should throw error if fetch fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const model = new ProductModel();

    await expect(model.getProductByBarcode('whatever')).rejects.toThrow(
      'Gagal mengambil produk'
    );
  });
});
