import { defineConfig } from 'vite';

// If you're using React or another framework, add the relevant plugin:
// import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint';
export default defineConfig({
  // plugins: [react()],
  server: {
    port: 3000,
    open: true, // Opens the browser automatically
  },
  build: {
    outDir: 'dist',
  },
  plugins: [eslint()],
  base: '/DynamicInterface',
});
