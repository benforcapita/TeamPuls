import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'node18',
    outDir: 'dist',
    ssr: 'src/index.tsx',
    rollupOptions: {
      external: ['jira-client', 'node-notifier', 'ollama', 'fs', 'path', 'os'],
    },
  },
});
