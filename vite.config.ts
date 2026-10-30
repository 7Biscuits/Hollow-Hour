import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: false,
    host: true,
    watch: {
      ignored: ['test_screenshots/**', '**/*.png', '*.png', '**/*.log', '**/scripts/**', '**/dist/**']
    }
  },
  build: {
    target: 'es2022',
    assetsInlineLimit: 0
  }
});
