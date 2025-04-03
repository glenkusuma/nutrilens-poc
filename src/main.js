// filepath: ./src/main.js
import './style.css';
import { ProductView } from './view/ProductView.js';
import { ProductController } from './controller/ProductController.js';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

const headerEl = document.querySelector('#header');
const contentEl = document.querySelector('#content');

const view = new ProductView(contentEl);
const controller = new ProductController(view);

// state stack untuk menyimpan riwayat state SPA
const stateStack = [];

/**
 * Mengonversi hash ke state object.
 * Contoh:
 * { type: "search", q: "nutella" }
 * { type: "category", c: "chocolates" }
 * { type: "detail", barcode: "123456789" }
 * { type: "scan" }
 */
function getStateFromHash(hash) {
  if (hash.startsWith('#/search')) {
    const urlParams = new URLSearchParams(hash.split('?')[1]);
    const q = urlParams.get('q') || '';
    return { type: 'search', q };
  } else if (hash.startsWith('#/category')) {
    const urlParams = new URLSearchParams(hash.split('?')[1]);
    const c = urlParams.get('c') || '';
    return { type: 'category', c };
  } else if (hash.startsWith('#/detail')) {
    const parts = hash.split('/');
    const barcode = parts[2];
    return { type: 'detail', barcode };
  } else if (hash.startsWith('#/scan')) {
    return { type: 'scan' };
  } else {
    return { type: 'home' };
  }
}

/**
 * Mengatur header sesuai state.
 */
function setHeader(state) {
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
    const categoryLinks = categories
      .map(
        (category) => /*HTML*/ `
        <a
          href="#/category?c=${category.query}"
          class="px-3 py-1 rounded text-md whitespace-nowrap ${
            state.type === 'category' && state.c === category.query
              ? 'bg-green-500 hover:bg-green-600  text-white'
              : 'bg-gray-200 text-black'
          }"
        >
          ${category.name}
        </a>
      `
      )
      .join('');
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
<p class="mb-4 text-gray-600">Berikut detail lengkap produk yang Anda pilih.</p>
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
  Gunakan kamera Anda untuk memindai barcode produk.
</p>
`;
  }
}

// Fungsi untuk kembali ke state sebelumnya
function popState() {
  stateStack.pop();
  const prevState = stateStack[stateStack.length - 1] || { type: 'home' };
  let newHash = '';
  if (prevState.type === 'search') {
    newHash = `#/search?q=${encodeURIComponent(prevState.q)}`;
  } else if (prevState.type === 'category') {
    newHash = `#/category?c=${encodeURIComponent(prevState.c)}`;
  } else if (prevState.type === 'detail') {
    newHash = `#/detail/${prevState.barcode}`;
  } else if (prevState.type === 'scan') {
    newHash = '#/scan';
  } else {
    newHash = '#/';
  }
  window.location.hash = newHash;
}
window.popState = popState;

/**
 * Render tampilan scan barcode menggunakan ZXing.
 */
function renderScanView() {
  contentEl.innerHTML = /*HTML*/ `
    <div class="relative flex flex-col items-center w-full max-w-md mx-auto">
      <!-- Video Container -->
      <div class="relative w-full h-[calc(80vh-150px)] bg-black rounded-lg overflow-hidden">
        <!-- Video -->
        <video id="video" class="absolute top-0 left-0 w-full h-full object-cover" autoplay playsinline></video>

        <!-- Barcode Target -->
        <div
          id="barcodeTarget"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style="width: 225px; height: 100px;"
        >
          <!-- Top-left corner -->
          <div class="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500"></div>
          <!-- Top-right corner -->
          <div class="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500"></div>
          <!-- Bottom-left corner -->
          <div class="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500"></div>
          <!-- Bottom-right corner -->
          <div class="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500"></div>
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="mt-4 flex gap-4">
        <button id="startButton" class="bg-green-500 hover:bg-green-600  text-white px-4 py-2 rounded">Start</button>
        <button id="stopButton" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Stop</button>
      </div>
      <p id="scanResult" class="mt-4 text-red-600"></p>
    </div>

    <!-- Modal -->
    <div id="modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
      <div class="bg-white rounded-lg p-6 w-3/4 max-w-sm text-center">
        <h2 id="modalTitle" class="text-xl font-bold mb-4">Scan Berhasil</h2>
        <p id="modalMessage" class="text-gray-700 mb-4"></p>
        <div id="loadingIcon" class="flex justify-center items-center hidden">
          <svg class="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
        <button id="modalCloseButton" class="bg-green-500 hover:bg-green-600  text-white px-4 py-2 rounded hidden">Close</button>
      </div>
    </div>
  `;

  const videoElem = document.getElementById('video');
  const barcodeTarget = document.getElementById('barcodeTarget');
  const resultElem = document.getElementById('scanResult');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const modalCloseButton = document.getElementById('modalCloseButton');
  const loadingIcon = document.getElementById('loadingIcon');
  const navbar = document.getElementById('bottomNav');
  const codeReader = new BrowserMultiFormatReader();
  let scanning = false;
  let timeoutId = null; // timer ID untuk menghentikan kamera

  // fungsi untuk memulai pemindaian
  const startScanning = async () => {
    try {
      scanning = true;
      barcodeTarget.style.display = 'block'; // aampilkan target barcode

      // set timer untuk menghentikan kamera setelah 5 menit
      timeoutId = setTimeout(
        () => {
          stopScanning();
          alert('Pemindaian dihentikan karena melebihi batas waktu 5 menit.');
        },
        5 * 60 * 1000
      ); // 5 menit dalam milidetik

      await codeReader.decodeFromVideoDevice(null, 'video', (result, err) => {
        if (result) {
          clearTimeout(timeoutId); // matikan timer jika barcode ditemukan
          codeReader.reset();
          scanning = false;
          barcodeTarget.style.display = 'none'; // hide target barcode

          // show modal dengan informasi barcode
          modalTitle.textContent = 'Scan Berhasil';
          modalMessage.textContent = `Barcode: ${result.text}`;
          modal.classList.remove('hidden');
          loadingIcon.classList.remove('hidden');
          modalCloseButton.classList.add('hidden');
          navbar.classList.add('hidden'); // hide navbar

          window.location.hash = `#/detail/${result.text}`;
          navbar.classList.remove('hidden'); // show kembali navbar
        }
        if (err && !(err instanceof NotFoundException)) {
          throw new Error('Kesalahan: ' + err.message);
        }
      });
    } catch (error) {
      console.error(error);

      // show modal error
      modalTitle.textContent = 'Scan Gagal';
      modalMessage.textContent =
        error.message || 'Terjadi kesalahan saat memindai barcode.';
      modal.classList.remove('hidden');
      loadingIcon.classList.add('hidden');
      modalCloseButton.classList.remove('hidden');
    }
  };

  // fungsi stop scan
  const stopScanning = () => {
    clearTimeout(timeoutId); // stop timer jika kamera distop secara manual
    codeReader.reset();
    scanning = false;
    barcodeTarget.style.display = 'none'; // Sembunyikan target barcode
    resultElem.textContent = 'Pemindaian dihentikan.';
  };

  // mulai pemindaian saat halaman dimuat
  startScanning();

  // event listener untuk tombol Start
  document.getElementById('startButton').addEventListener('click', () => {
    if (!scanning) {
      startScanning();
    }
  });

  // event listener untuk tombol Stop
  document.getElementById('stopButton').addEventListener('click', () => {
    stopScanning();
  });

  // event listener untuk tombol Close pada modal
  modalCloseButton.addEventListener('click', () => {
    modal.classList.add('hidden');
    navbar.classList.remove('hidden'); // show kembali navbar
  });

  // Hentikan pemindaian jika hash berubah
  window.addEventListener('hashchange', () => {
    if (scanning) {
      stopScanning();
    }
  });
}

function handleHashChange() {
  const hash = window.location.hash || '';
  const newState = getStateFromHash(hash);

  if (newState.type === 'home') {
    stateStack.length = 0; // clear state stack ketika home
  }

  // Tambahkan state 'scan' ke stateStack sebelum 'detail'
  if (
    newState.type === 'detail' &&
    stateStack[stateStack.length - 1]?.type === 'scan'
  ) {
    stateStack.push({ type: 'scan' });
  }

  if (
    stateStack.length === 0 ||
    JSON.stringify(stateStack[stateStack.length - 1]) !==
      JSON.stringify(newState)
  ) {
    stateStack.push(newState);
  }

  setHeader(newState);

  if (newState.type === 'search') {
    const query = newState.q;
    if (!query) {
      view.renderError('Mohon masukkan kata kunci pencarian');
      return;
    }

    // show skeleton loading
    view.renderSkeleton();

    // ambil data setelah skeleton ditampilkan
    document.getElementById('searchQuery').innerHTML =
      `<span>Hasil pencarian untuk <b>'${query}'</b></span>`;
    controller.searchByQuery(query);
  } else if (newState.type === 'category') {
    const cat = newState.c;
    if (!cat) {
      view.renderError('Mohon pilih kategori');
      return;
    }

    // show skeleton loading
    view.renderSkeleton();

    // get data setelah skeleton ditampilkan
    document.getElementById('searchQuery').innerHTML =
      `<span>Hasil pencarian kategori <b>'${cat}'</b></span>`;
    controller.searchByCategory(cat);
  } else if (newState.type === 'detail') {
    const barcode = newState.barcode;
    if (!barcode) {
      view.renderError('Barcode tidak ditemukan di URL');
      return;
    }
    controller.showProductDetail(barcode);
  } else if (newState.type === 'scan') {
    renderScanView();
  } else {
    contentEl.innerHTML =
      'Silakan gunakan form pencarian atau pilih kategori di atas untuk memulai pencarian.<br><br>jika kamu ingin melakukan scan barcode produk untuk mengetahui nutriscore, gunakan fitur scan pada navbar. <br><br>Selamat mencoba proof of concept aplikasi ini :D';
  }
}

/**
 * Toggle the visibility of the bottom navigation bar.
 */
function toggleBottomNav() {
  const nav = document.getElementById('bottomNav');
  const hash = window.location.hash || '';
  // Hide NAV ketika di page detail (hash: #/detail/xxx)
  if (hash.startsWith('#/detail/')) {
    nav.classList.add('hidden');
  } else {
    nav.classList.remove('hidden');
  }
}

window.addEventListener('hashchange', toggleBottomNav);
window.addEventListener('load', toggleBottomNav);

window.addEventListener('hashchange', handleHashChange);
window.addEventListener('load', handleHashChange);
