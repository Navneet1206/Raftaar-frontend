import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    proxy: {
      '/rides': 'https://raftaar-backend.vercel.app',
      '/captains': 'https://raftaar-backend.vercel.app',
      '/users': 'https://raftaar-backend.vercel.app',
      '/socket.io': {
        target:'https://raftaar-backend.vercel.app',
        ws: true,
      },
    },
  },
});
