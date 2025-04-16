import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      indent: ['error', 2],
      "no-useless-constructor": "off",
      "no-new": "off",
      "allowObjectTypes": "on",
    },
  }
);