// filepath: ./src/main.js
import './style.css';
import { ProductView } from './view/ProductView.js';
import { ProductController } from './controller/ProductController.js';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

const headerEl = document.querySelector('#header');
const contentEl = document.querySelector('#content');

const view = new ProductView(contentEl);
const controller = new ProductController(view);

// State stack untuk menyimpan riwayat state SPA
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
  if (
    state.type === 'search' ||
    state.type === 'category' ||
    state.type === 'home'
  ) {
    headerEl.innerHTML = `
      <h1 class="text-2xl font-bold mb-2">NutriLens</h1>
      <div class="mb-4 flex flex-col md:flex-row gap-2 md:gap-4">
        <form id="searchForm" class="md:w-1/2 flex">
          <input type="text" name="q" placeholder="Cari produk berdasarkan kata kunci..."
            class="border w-full p-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-300"/>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600">Cari</button>
        </form>
        <a href="#/scan" class="bg-green-500 text-white px-4 py-2 rounded inline-block text-center hover:bg-green-600">
          Scan by Kamera
        </a>
      </div>
      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">Kategori Populer:</h3>
        <div class="flex flex-wrap gap-2">
          <a href="#/category?c=chocolates" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Chocolates</a>
          <a href="#/category?c=milk" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Milk</a>
          <a href="#/category?c=snacks" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Snacks</a>
          <a href="#/category?c=beverages" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Beverages</a>
          <a href="#/category?c=cereals" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Cereals</a>
        </div>
      </div>
      <h2 id="searchQuery" class="text-xl mb-4 font-semibold"></h2>
    `;
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
    headerEl.innerHTML = `
      <div class="flex items-center mb-4">
        <button onclick="popState()" class="text-blue-500 underline mr-4">Kembali</button>
        <h1 class="text-2xl font-bold">Detail Produk</h1>
      </div>
      <p class="mb-4 text-gray-600">Berikut detail lengkap produk yang Anda pilih.</p>
    `;
  } else if (state.type === 'scan') {
    headerEl.innerHTML = `
      <div class="flex items-center mb-4">
        <button onclick="popState()" class="text-blue-500 underline mr-4">Kembali</button>
        <h1 class="text-2xl font-bold">Scan Barcode</h1>
      </div>
      <p class="mb-4 text-gray-600">Gunakan kamera Anda untuk memindai barcode produk.</p>
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
  contentEl.innerHTML = `
    <div class="flex flex-col items-center">
      <video id="video" class="border mb-4" width="300" height="200"></video>
      <div>
        <button id="startButton" class="bg-blue-500 text-white px-4 py-2 mr-2">Mulai Scan</button>
        <button id="stopButton" class="bg-gray-500 text-white px-4 py-2">Stop</button>
      </div>
      <p id="scanResult" class="mt-4 text-red-600"></p>
    </div>
  `;

  const videoElem = document.getElementById('video');
  const resultElem = document.getElementById('scanResult');
  const codeReader = new BrowserMultiFormatReader();
  let scanning = false;

  document.getElementById('startButton').addEventListener('click', () => {
    if (!scanning) {
      scanning = true;
      codeReader.decodeFromVideoDevice(null, 'video', (result, err) => {
        if (result) {
          codeReader.reset();
          scanning = false;
          // Pindah ke detail produk setelah barcode terdeteksi
          window.location.hash = `#/detail/${result.text}`;
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error(err);
          resultElem.textContent = 'Kesalahan: ' + err;
        }
      });
    }
  });

  document.getElementById('stopButton').addEventListener('click', () => {
    codeReader.reset();
    scanning = false;
    resultElem.textContent = 'Pemindaian dihentikan.';
  });
}

function handleHashChange() {
  const hash = window.location.hash || '';
  const newState = getStateFromHash(hash);

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
    document.getElementById('searchQuery').textContent =
      `Hasil pencarian untuk '${query}'`;
    controller.searchByQuery(query);
  } else if (newState.type === 'category') {
    const cat = newState.c;
    if (!cat) {
      view.renderError('Mohon pilih kategori');
      return;
    }
    document.getElementById('searchQuery').textContent =
      `Hasil pencarian kategori '${cat}'`;
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
      'Silakan gunakan form pencarian atau pilih kategori di atas.';
  }
}

window.addEventListener('hashchange', handleHashChange);
window.addEventListener('load', handleHashChange);
