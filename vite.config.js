import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

// function to check if SSL files exist
function getHttpsConfig() {
  const keyPath = path.resolve('./ssl/localhost.key');
  const certPath = path.resolve('./ssl/localhost.crt');

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }

  return false;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: true, // Allows access on local network
    https: getHttpsConfig(), // Conditionally set HTTPS config
  },
});