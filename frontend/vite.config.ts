import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'https://icebreaker.zafarr.xyz',
      '/health': 'https://icebreaker.zafarr.xyz',
      '/socket.io': {
        target: 'wss:/icebreaker.zafarr.xyz',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
