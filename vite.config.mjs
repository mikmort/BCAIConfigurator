import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'src',
  plugins: [react()],
  build: {
    // output to project level dist instead of src/dist
    outDir: '../dist',
  },
});
