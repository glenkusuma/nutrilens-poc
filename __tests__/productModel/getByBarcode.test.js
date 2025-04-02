// filepath: ./__tests__/productModel.test.js
import { ProductModel } from '../../src/model/ProductModel.js';
import { readFileSync } from 'fs';
import path from 'path';

const nutellaResponse = JSON.parse(
  readFileSync(path.resolve(__dirname, '../../__mock__/nutella-ferrero.json'))
);

const requiredFields = {
  'product.product_name': 'Product name',
  'product.product_name_en': 'Full name',
  'product.code': 'Barcode',
  'product.quantity': 'Net size',
  'product.nutriscore_grade': 'NutriScore',
  'product.ecoscore_grade': 'EcoScore',
  'product.nova_group': 'NovaScore',
  'product.image_nutrition_url': 'Nutrition image',
  'product.image_packaging_url': 'Packaging image',
  'product.image_url': 'Main product image',
  'product.ingredients_text': 'Ingredients description',
  'product.nutriments.energy-kcal_100g': 'Calories',
  'product.nutriments.fat_100g': 'Total fat',
  'product.nutriments.saturated-fat_100g': 'Saturated fat',
  'product.nutriments.carbohydrates_100g': 'Carbohydrates',
  'product.nutriments.proteins_100g': 'Protein',
  'product.nutriments.sugars_100g': 'Sugar',
  'product.nutriments.salt_100g': 'Salt',
};

describe('ProductModel using mocked fetch', () => {
  let model;

  beforeEach(() => {
    model = new ProductModel();

    // mock global fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => nutellaResponse,
    });
  });

  test('should fetch Nutella Ferrero product and contain all required fields', async () => {
    const data = await model.getProductByBarcode('3017620422003');
    expect(data.status).toBe(1);

    for (const key of Object.keys(requiredFields)) {
      const value = key
        .split('.')
        .reduce((acc, part) => acc && acc[part], data);
      expect(value).toBeDefined();
    }
  });

  test('should match snapshot of entire Nutella Ferrero response', async () => {
    const data = await model.getProductByBarcode('3017620422003');
    expect(data).toMatchSnapshot();
  });

  test('should match snapshot of selected fields only', async () => {
    const data = await model.getProductByBarcode('3017620422003');
    const p = data.product;

    const snapshotData = {
      name: p.product_name,
      energy: p.nutriments['energy-kcal_100g'],
      nutriscore: p.nutriscore_grade,
      ecoscore: p.ecoscore_grade,
      nova: p.nova_group,
    };
    expect(snapshotData).toMatchSnapshot();
  });

  test('should throw error if fetch fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(model.getProductByBarcode('invalid')).rejects.toThrow(
      'Gagal mengambil produk'
    );
  });
});
