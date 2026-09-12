import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const frontendRoot = fileURLToPath(new URL('./', import.meta.url));
const projectRoot = fileURLToPath(new URL('../', import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: frontendRoot,
  envDir: projectRoot,
  server: {
    host: true,
    port: 5173,
    allowedHosts: true
  }
});

