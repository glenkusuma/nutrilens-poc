// filepath: ./src/main.js
import './style.css';
import { ProductView } from './view/ProductView.js';
import { ProductController } from './controller/ProductController.js';
import {
  stateStack,
  getStateFromHash,
  popState,
  toggleBottomNav,
} from './router/router.js';
import { renderScanView } from './components/scanner.js';
import { setHeader } from './components/header.js';
import { initNavigation } from './components/navigation.js';

// Expose popState function globally for header back buttons
window.popState = popState;

// Main app elements
const headerEl = document.querySelector('#header');
const contentEl = document.querySelector('#content');
const navEl = document.querySelector('#bottomNav');

// Initialize navigation
initNavigation(navEl);

// Initialize view and controller
const view = new ProductView(contentEl);
const controller = new ProductController(view);

/**
 * Main function to handle route/hash changes
 */
function handleHashChange() {
  const hash = window.location.hash || '';
  const newState = getStateFromHash(hash);

  // Reset state stack on home
  if (newState.type === 'home') {
    stateStack.length = 0;
  }

  // Special handling for scan -> detail transition
  if (
    newState.type === 'detail' &&
    stateStack[stateStack.length - 1]?.type === 'scan'
  ) {
    stateStack.push({ type: 'scan' });
  }

  // Only add to stack if different from current state
  if (
    stateStack.length === 0 ||
    JSON.stringify(stateStack[stateStack.length - 1]) !==
      JSON.stringify(newState)
  ) {
    stateStack.push(newState);
  }

  // Update the header based on current state
  setHeader(headerEl, newState);

  // Handle different routes
  if (newState.type === 'search') {
    const query = newState.q;
    if (!query) {
      view.renderError('Mohon masukkan kata kunci pencarian');
      return;
    }

    // Show loading skeleton
    view.renderSkeleton();

    // Update search query display
    document.getElementById('searchQuery').innerHTML =
      `<span>Hasil pencarian untuk <b>'${query}'</b></span>`;

    // Get search results
    controller.searchByQuery(query);
  } else if (newState.type === 'category') {
    const cat = newState.c;
    if (!cat) {
      view.renderError('Mohon pilih kategori');
      return;
    }

    // Show loading skeleton
    view.renderSkeleton();

    // Update search query display for category
    document.getElementById('searchQuery').innerHTML =
      `<span>Hasil pencarian kategori <b>'${cat}'</b></span>`;

    // Get category results
    controller.searchByCategory(cat);
  } else if (newState.type === 'detail') {
    const barcode = newState.barcode;
    if (!barcode) {
      view.renderError('Barcode tidak ditemukan di URL');
      return;
    }
    // Show product details
    controller.showProductDetail(barcode);
  } else if (newState.type === 'scan') {
    // Render barcode scanner
    renderScanView(contentEl);
  } else if (newState.type === 'favorites') {
    // Would implement favorites functionality
    contentEl.innerHTML =
      '<div class="p-4 text-center"><h2 class="text-xl font-bold mb-2">Produk Tersimpan</h2><p>Fitur ini belum diimplementasikan dalam proof of concept.</p></div>';
  } else {
    // Home page
    contentEl.innerHTML =
      '<div class="p-4"><p class="mb-3">Silakan gunakan form pencarian atau pilih kategori di atas untuk memulai pencarian.</p><p class="mb-3">Jika kamu ingin melakukan scan barcode produk untuk mengetahui nutriscore, gunakan fitur scan pada navbar.</p><p class="mb-3">Selamat mencoba proof of concept aplikasi ini :D</p></div>';
  }
}

// Set up event listeners
window.addEventListener('hashchange', toggleBottomNav);
window.addEventListener('load', toggleBottomNav);
window.addEventListener('hashchange', handleHashChange);
window.addEventListener('load', handleHashChange);
