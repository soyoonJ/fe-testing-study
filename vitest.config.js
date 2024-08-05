import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['node_modules'],
    globals: true, // vitest에서 제공하는 API들을 별도의 import 없이 사용 가능
    environment: 'jsdom',
    setupFiles: './src/utils/test/setupTests.js',
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },
});
