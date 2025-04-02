// filepath: ./src/view/ProductView.js
export class ProductView {
  constructor(rootElement) {
    this.app = rootElement;
  }

  // Helper untuk mendapatkan URL gambar Nutri‑Score (v2)
  getNutriScoreImage(grade) {
    if (!grade)
      return 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-unknown-new-en.svg';
    grade = grade.toUpperCase();
    const mapping = {
      A: 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-a-new-en.svg',
      B: 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-b-new-en.svg',
      C: 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-c-new-en.svg',
      D: 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-d-new-en.svg',
      E: 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-e-new-en.svg',
    };
    return (
      mapping[grade] ||
      'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-unknown-new-en.svg'
    );
  }

  // Helper untuk mendapatkan URL gambar EcoScore
  getEcoScoreImage(grade) {
    if (!grade)
      return 'https://static.openfoodfacts.org/images/attributes/dist/green-score-unknown.svg';
    grade = grade.toUpperCase();
    const mapping = {
      A: 'https://static.openfoodfacts.org/images/attributes/dist/green-score-a.svg',
      B: 'https://static.openfoodfacts.org/images/attributes/dist/green-score-b.svg',
      C: 'https://static.openfoodfacts.org/images/attributes/dist/green-score-c.svg',
      D: 'https://static.openfoodfacts.org/images/attributes/dist/green-score-d.svg',
      E: 'https://static.openfoodfacts.org/images/attributes/dist/green-score-e.svg',
      F: 'https://static.openfoodfacts.org/images/attributes/dist/green-score-f.svg',
    };
    return (
      mapping[grade] ||
      'https://static.openfoodfacts.org/images/attributes/dist/green-score-unknown.svg'
    );
  }

  // Helper untuk mendapatkan URL gambar NovaGroup
  getNovaGroupImage(group) {
    if (!group)
      return 'https://static.openfoodfacts.org/images/attributes/dist/nova-group-unknown.svg';
    const mapping = {
      1: 'https://static.openfoodfacts.org/images/attributes/dist/nova-group-1.svg',
      2: 'https://static.openfoodfacts.org/images/attributes/dist/nova-group-2.svg',
      3: 'https://static.openfoodfacts.org/images/attributes/dist/nova-group-3.svg',
      4: 'https://static.openfoodfacts.org/images/attributes/dist/nova-group-4.svg',
    };
    return (
      mapping[group.toString()] ||
      'https://static.openfoodfacts.org/images/attributes/dist/nova-group-unknown.svg'
    );
  }

  /**
   * Render a list of product search results with minimal card style.
   * @param {array} products - The array of products from the API.
   * @param {string} type - "query" or "category" or something else to describe the search
   */
  renderSearchResults(products, type) {
    let html = `
      <h1 class="text-2xl font-bold mb-4">Hasil Pencarian (${type})</h1>
    `;
    products.forEach((item) => {
      const productName = item.product_name || 'Produk tanpa nama';
      const code = item.code || 'N/A';
      const image =
        item.image_front_small_url || 'https://via.placeholder.com/64x64';
      const nutritionGrade = item.nutrition_grades
        ? item.nutrition_grades.toUpperCase()
        : 'N/A';

      html += `
        <a
          href="#/detail/${code}"
          class="block p-4 mb-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          <div class="flex items-center">
            <img src="${image}" alt="${productName}" class="w-16 h-16 object-cover" />
            <div class="ml-4">
              <div class="font-semibold">${productName}</div>
              <div class="text-sm text-gray-500">Nutri-Grade: ${nutritionGrade}</div>
            </div>
          </div>
        </a>
      `;
    });
    this.app.innerHTML = html;
  }

  renderProductCard(product) {
    // Ambil field-field utama dengan fallback value
    const {
      product_name = 'N/A',
      product_name_en = '',
      code = 'N/A',
      quantity = 'N/A',
      nutriscore_grade,
      ecoscore_grade,
      nova_group,
      ingredients_text = '',
      categories = '',
      categories_hierarchy = '',
      vitamins_tags = '',
      nutriments = {},
    } = product;

    // Nutriments
    const energy = nutriments['energy-kcal_100g'] || 'N/A';
    const fat = nutriments['fat_100g'] || 'N/A';
    const satFat = nutriments['saturated-fat_100g'] || 'N/A';
    const carbs = nutriments['carbohydrates_100g'] || 'N/A';
    const protein = nutriments['proteins_100g'] || 'N/A';
    const sugars = nutriments['sugars_100g'] || 'N/A';
    const salt = nutriments['salt_100g'] || 'N/A';

    // Gambar utama & gambar tambahan
    const {
      image_url = 'https://via.placeholder.com/300x300',
      image_front_small_url = '',
      image_front_thumb_url = '',
      image_front_url = '',
      image_ingredients_small_url = '',
      image_ingredients_thumb_url = '',
      image_ingredients_url = '',
      image_nutrition_small_url = '',
      image_nutrition_thumb_url = '',
      image_small_url = '',
      image_thumb_url = '',
    } = product;

    // Tentukan URL gambar untuk NutriScore, EcoScore, dan NovaGroup
    const nutriScoreImage = this.getNutriScoreImage(nutriscore_grade);
    const ecoScoreImage = this.getEcoScoreImage(ecoscore_grade);
    const novaGroupImage = this.getNovaGroupImage(nova_group);

    // Pastikan bahwa categories_hierarchy dan vitamins_tags adalah array
    const categoriesArray = Array.isArray(categories_hierarchy)
      ? categories_hierarchy
      : [];
    const vitaminsArray = Array.isArray(vitamins_tags) ? vitamins_tags : [];

    this.app.innerHTML = `
        <section class="bg-gray-50 py-8 antialiased md:py-12">
          <div class="mx-auto max-w-xl px-4">
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow">
              <!-- Product Main Image -->
              <div class="flex justify-center mb-4">
                <img src="${image_url}" alt="${product_name}" class="h-96 w-auto object-contain">
              </div>
              <!-- Product Title & Basic Info -->
              <h1 class="text-2xl font-bold text-gray-800 mb-1">${product_name}</h1>
              <p class="text-gray-600 mb-2">${product_name_en}</p>
              <p class="text-sm text-gray-500 mb-4">Barcode: ${code} | Netsize: ${quantity}</p>
              
              <!-- Score Images -->
              <div class="flex items-center space-x-4 mb-4">
                <div class="flex flex-col items-center">
                  <img src="${nutriScoreImage}" alt="NutriScore" class="h-12 w-auto">
                  <span class="text-sm text-gray-600">NutriScore</span>
                </div>
                <div class="flex flex-col items-center">
                  <img src="${ecoScoreImage}" alt="EcoScore" class="h-12 w-auto">
                  <span class="text-sm text-gray-600">EcoScore</span>
                </div>
                <div class="flex flex-col items-center">
                  <img src="${novaGroupImage}" alt="NovaGroup" class="h-12 w-auto">
                  <span class="text-sm text-gray-600">NovaGroup</span>
                </div>
              </div>
              
              <!-- Nutritional Information -->
              <div class="mb-4">
                <h2 class="font-semibold text-gray-800 mb-2">Nutritional Information</h2>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li>Kalori: ${energy} kcal</li>
                  <li>Total Fat: ${fat} g</li>
                  <li>Saturated Fat: ${satFat} g</li>
                  <li>Carbohidrat: ${carbs} g</li>
                  <li>Protein: ${protein} g</li>
                  <li>Gula: ${sugars} g</li>
                  <li>Garam: ${salt} g</li>
                </ul>
              </div>
              
              <!-- Ingredients -->
              <div class="mb-4">
                <h2 class="font-semibold text-gray-800 mb-2">Komposisi Produk</h2>
                <p class="text-sm text-gray-600">${ingredients_text.split('.').join('.</br>')}</p>
              </div>
              
              <!-- Additional Details -->
              <div class="mb-4">
                <h2 class="font-semibold text-gray-800 mb-2">Informasi Lainnya</h2>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li><strong>Kategori:</strong> 
                    <ul>
                      ${categoriesArray.map((category) => `<li>${category}</li>`).join('')}
                    </ul>
                  </li>
                  <li><strong>Vitamins Tags:</strong> 
                    <ul>
                      ${vitaminsArray.map((vitamin) => `<li>${vitamin}</li>`).join('')}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      `;
  }

  /**
   * Render daftar hasil pencarian dengan card layout.
   * Setiap card menggunakan standar ukuran (misal "w-80") dan gambar produk ditampilkan dengan "object-contain" agar fit.
   */
  renderSearchResults(products) {
    if (!products || products.length === 0) {
      this.app.innerHTML = '<p>Tidak ada produk ditemukan.</p>';
      return;
    }
    let html = `<div class="flex flex-wrap gap-4">`;
    products.forEach((p) => {
      const {
        code = '',
        product_name = '(Tanpa Nama)',
        brands = '',
        quantity = '',
        labels_tags = [],
        origins_tags = [],
        nutrition_grades,
        ecoscore_grade,
        nova_groups,
        image_front_small_url,
      } = p;

      const labels = labels_tags.join(', ') || '-';
      const origins = origins_tags.join(', ') || '-';
      const image =
        image_front_small_url ||
        'https://placehold.co/300x200?text=Gambar+Tidak+Tersedia';

      const nutriImg = this.getNutriScoreImage(nutrition_grades);
      const ecoImg = this.getEcoScoreImage(ecoscore_grade);
      const novaImg = this.getNovaGroupImage(nova_groups);

      html += `
        <div class="w-92 bg-white border border-gray-200 rounded-lg shadow overflow-hidden flex flex-col">
          <a href="#/detail/${code}">
            <img class="rounded-t-lg w-full h-48 object-cover" src="${image}" alt="${product_name}" />
          </a>
          <div class="p-5 flex flex-col flex-1">
            <a href="#/detail/${code}">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                ${product_name}
              </h5>
            </a>
            <p class="mb-1 text-sm text-gray-700"><strong>Brand:</strong> ${brands}</p>
            <p class="mb-1 text-sm text-gray-700"><strong>Quantity:</strong> ${quantity}</p>
            <p class="mb-1 text-sm text-gray-700"><strong>Labels:</strong> ${labels}</p>
            <p class="mb-3 text-sm text-gray-700"><strong>Origins:</strong> ${origins}</p>
            <div class="flex items-center gap-2 mb-3">
              <img src="${nutriImg}" alt="NutriScore" class="h-8 w-auto" />
              <img src="${ecoImg}" alt="EcoScore" class="h-8 w-auto" />
              <img src="${novaImg}" alt="NovaGroup" class="h-8 w-auto" />
            </div>
            <a href="#/detail/${code}" class="mt-auto inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
              Lihat Detail
              <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
            </a>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    this.app.innerHTML = html;
  }

  
  renderError(message) {
    this.app.innerHTML = `<p class="text-red-500 text-center">Error: ${message}</p>`;
  }
}
