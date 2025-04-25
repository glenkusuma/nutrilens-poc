// filepath: ./src/router/router.js

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

export { stateStack, getStateFromHash, popState, toggleBottomNav };
