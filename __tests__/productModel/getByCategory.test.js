// __tests__/integration/productModel/getByCategory.test.js

import { ProductModel } from '../../src/model/ProductModel.js';

describe('ProductModel.getByCategory with Sanpshots', () => {
  let productModel;

  beforeAll(() => {
    productModel = new ProductModel();
  });

  it('should return a valid snapshot response for keyword "chocolate"', async () => {
    const keyword = 'chocolate';
    const response = await productModel.getByCategory(keyword);
    // snapshot seluruh response (object yang dikembalikan API)
    expect(response).toMatchSnapshot('chocolate category response');
  });

  it('should return a valid snapshot response for a non-existing keyword', async () => {
    const keyword = 'nonexistentkeyword123';
    const response = await productModel.getByCategory(keyword);
    expect(response).toMatchSnapshot('non-existing keyword response');
  });

  it('should return a valid snapshot response for keyword "milk"', async () => {
    const keyword = 'milk';
    const response = await productModel.getByCategory(keyword);
    expect(response).toMatchSnapshot('milk category response');
  });

  it('should return a valid snapshot response for keyword "snacks"', async () => {
    const keyword = 'snacks';
    const response = await productModel.getByCategory(keyword);
    expect(response).toMatchSnapshot('snacks category response');
  });

  // jika input kosong dianggap tidak valid, sebaiknya kita tangkap error-nya.
  // namun, berdasarkan implementasi saat ini, getByCategory tidak melempar error untuk string kosong.
  // agar mudah debug, kita snapshot response untuk input kosong.
  it('should return a valid snapshot response for an empty string keyword', async () => {
    const keyword = '';
    const response = await productModel.getByCategory(keyword);
    expect(response).toMatchSnapshot('empty string keyword response');
  });
});
