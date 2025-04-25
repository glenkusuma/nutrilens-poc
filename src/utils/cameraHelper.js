// filepath: ./src/utils/cameraHelper.js

/**
 * Menampilkan dan memungkinkan user memilih kamera yang tersedia.
 * @returns {Promise<string>} Promise yang menghasilkan ID kamera yang dipilih
 */
async function selectCamera() {
  try {
    // Dapatkan daftar perangkat media yang tersedia
    const devices = await navigator.mediaDevices.enumerateDevices();

    // Filter hanya kamera video
    const videoDevices = devices.filter(
      (device) => device.kind === 'videoinput'
    );

    if (videoDevices.length === 0) {
      throw new Error('Tidak ada kamera yang tersedia pada perangkat ini');
    }

    // Jika hanya ada satu kamera, gunakan langsung
    if (videoDevices.length === 1) {
      return videoDevices[0].deviceId;
    }

    // Buat UI untuk memilih kamera
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className =
        'fixed inset-0 backdrop-blur-md flex items-center justify-center z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-3/4 max-w-sm">
          <h2 class="text-xl font-bold mb-4">Pilih Kamera</h2>
          <div id="camera-list" class="flex flex-col gap-2 mb-4">
            ${videoDevices
              .map(
                (device, index) => `
              <button 
                data-device-id="${device.deviceId}" 
                class="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded text-left"
              >
                ${device.label || `Kamera ${index + 1}`}
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Tambahkan event listener untuk tombol
      const cameraButtons = modal.querySelectorAll('[data-device-id]');
      cameraButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const deviceId = button.getAttribute('data-device-id');
          document.body.removeChild(modal);
          resolve(deviceId);
        });
      });
    });
  } catch (error) {
    console.error('Error accessing media devices:', error);
    return null; // Return null to use default camera
  }
}

export { selectCamera };
