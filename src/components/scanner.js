// filepath: ./src/components/scanner.js

import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { selectCamera } from '../utils/cameraHelper.js';

/**
 * Render tampilan scan barcode menggunakan ZXing.
 * @param {HTMLElement} contentEl - Element to render the scanner into
 */
function renderScanView(contentEl) {
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
        <button id="startButton" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Start</button>
        <button id="stopButton" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Stop</button>
        <button id="switchCameraButton" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4v16a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2zm12 0h.01M16 16a4 4 0 11-8 0 4 4 0 018 0zm-4 3a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
        </button>
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
  let currentDeviceId = null; // ID perangkat kamera yang sedang digunakan

  // Tombol untuk mengganti kamera
  const switchCameraButton = document.getElementById('switchCameraButton');
  switchCameraButton.addEventListener('click', async () => {
    if (scanning) {
      stopScanning();
    }
    currentDeviceId = await selectCamera();
    startScanning();
  });

  // fungsi untuk memulai pemindaian dengan kamera yang dipilih
  const startScanning = async () => {
    try {
      scanning = true;
      barcodeTarget.style.display = 'block'; // tampilkan target barcode

      // set timer untuk menghentikan kamera setelah 5 menit
      timeoutId = setTimeout(
        () => {
          stopScanning();
          alert('Pemindaian dihentikan karena melebihi batas waktu 5 menit.');
        },
        5 * 60 * 1000
      ); // 5 menit dalam milidetik

      await codeReader.decodeFromVideoDevice(
        currentDeviceId,
        'video',
        (result, err) => {
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
        }
      );
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

export { renderScanView };
