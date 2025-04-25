// filepath: ./src/components/header.js

/**
 * Mengatur header sesuai state.
 * @param {HTMLElement} headerEl - Header element to update
 * @param {Object} state - Current app state
 */
function setHeader(headerEl, state) {
  // untuk scroll serach query
  if (headerEl.classList.contains(' -top-52')) {
    headerEl.classList.remove(' -top-52');
  }
  if (headerEl.classList.contains('top-0')) {
    headerEl.classList.remove('top-0');
  }
  if (
    state.type === 'search' ||
    state.type === 'category' ||
    state.type === 'home'
  ) {
    const categories = [
      { name: 'Chocolates', query: 'chocolates' },
      { name: 'Milk', query: 'milk' },
      { name: 'Snacks', query: 'snacks' },
      { name: 'Beverages', query: 'beverages' },
      { name: 'Cereals', query: 'cereals' },
      { name: 'Noodles', query: 'noodles' },
      { name: 'Biskuit', query: 'biskuit' },
      { name: 'Pasta', query: 'pasta' },
      { name: 'Instant noodle', query: 'instant-noodle' },
      { name: 'Susu', query: 'susu' },
    ];

    headerEl.innerHTML = /*HTML*/ `<h1 class="text-2xl font-bold pb-2">NutriLens SPA POC</h1>
<p class="text-gray-600 text-md pb-2">Apa yang kamu mau Explore Hari ini? :D</p>
<!-- Search form -->
<form
  id="searchForm"
  class="flex items-center bg-white rounded shadow border border-gray-200 p-2 mb-4"
>
  <svg
    class="w-5 h-5 text-gray-400 mr-2"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    viewBox="0 0 24 24"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
  <input
    type="text"
    name="q"
    placeholder="Search product..."
    class="flex-1 focus:outline-none focus:ring-2 focus:ring-green-500 text-md"
  />
  <button
    type="submit"
    class="ml-1 bg-green-500 hover:bg-green-600 text-white px-2 py-0.5 rounded"
  >
    Search
  </button>
</form>

<!-- Categories -->
<div class="mb-2">
  <h2 class="font-semibold mb-2">Explore Categories</h2>
  <!-- no-scrollbar custom @utility to style.css -->
  <div class="flex gap-2 overflow-x-auto no-scrollbar pb-2">
    ${categories
      .map(
        (category) => /*HTML*/ `
    <a
      href="#/category?c=${category.query}"
      class="px-3 py-1 rounded text-md whitespace-nowrap transition-all duration-200 ${state.type === 'category' && state.c === category.query ? 'bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 text-black'}"
    >
      ${category.name}
    </a>
    `
      )
      .join('')}
  </div>
</div>

<!-- Search results -->
<div id="searchQuery" class="sticky top-100 p-2"></div>
`;
    headerEl.classList.add(`-top-52`);
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = e.target.elements.q.value.trim();
        if (q) {
          window.location.hash = `#/search?q=${encodeURIComponent(q)}`;
        }
      });
    }
  } else if (state.type === 'detail') {
    headerEl.classList.add(`top-0`);
    headerEl.innerHTML = /*HTML*/ `<div class="flex items-center mb-4">
  <button
    onclick="popState()"
    class="hover:cursor-pointer border-1 rounded-sm border-gray-300"
  >
    <svg
      onclick="popState()"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-8"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  </button>
  <h1 class="pl-4 text-2xl font-bold">Detail Produk</h1>
</div>
`;
  } else if (state.type === 'scan') {
    headerEl.classList.add(`top-0`);
    headerEl.innerHTML = /*HTML*/ `<div class="flex items-center mb-4">
  <button
    onclick="popState()"
    class="hover:cursor-pointer border-1 rounded-sm border-gray-300"
  >
    <svg
      onclick="popState()"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-8"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  </button>
  <h1 class="pl-4 text-2xl font-bold">Scan Barcode</h1>
</div>
<p class="mb-4 text-gray-600">
  Gunakan kamera kamu untuk memindai barcode produk.
</p>
`;
  }
}

export { setHeader };
