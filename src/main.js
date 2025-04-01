import './style.css';
import { ProductModel } from './model/ProductModel.js';

const app = document.querySelector('#app');
const model = new ProductModel();

// Contoh barcode: Nutella - Ferrero - 1kg
const testBarcode = '3017624010701';

model
  .getProductByBarcode(testBarcode)
  .then((data) => {
    const product = data.product;

    app.innerHTML = `
      <div class="p-4 border rounded bg-white shadow">
        <h1 class="text-2xl font-bold mb-2">${product.product_name || 'Tanpa Nama'}</h1>
        <img src="${product.image_url || ''}" alt="Gambar Produk" class="w-48 mb-2" />
        <p class="mb-1"><strong>Nutri-Grade:</strong> ${product.nutrition_grades?.toUpperCase() || 'N/A'}</p>
        <p class="mb-1"><strong>Energi:</strong> ${product.nutriments['energy-kcal_100g'] || 'N/A'} kcal</p>
        <p class="mb-1"><strong>Lemak:</strong> ${product.nutriments['fat_100g'] || 'N/A'} g</p>
        <p class="mb-1"><strong>Gula:</strong> ${product.nutriments['sugars_100g'] || 'N/A'} g</p>
        <p class="mb-1"><strong>Garam:</strong> ${product.nutriments['salt_100g'] || 'N/A'} g</p>
      </div>
    `;
  })
  .catch((err) => {
    app.innerHTML = `<p class="text-red-500">Error: ${err.message}</p>`;
    console.error(err);
  });
