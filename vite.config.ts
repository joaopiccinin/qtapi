import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    globals: true,
  },
});