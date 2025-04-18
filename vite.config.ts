import tsConfigPaths from 'vite-tsconfig-paths';

export default {
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
};
