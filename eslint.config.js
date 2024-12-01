const pluginJs = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier');
const prettierPrettier = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = [
  { ignores: ['node_modules/*', 'dist/*', 'build/*'] },
  pluginJs.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPrettier,
    },
    rules: {
      'prettier/prettier': ['error', { usePrettierrc: true }],
      ...prettierConfig.rules,
      'no-use-before-define': 'off',
      'import/extensions': 'off',
      'no-console': 'off',
      'nonblock-statement-body-position': 'off',
    },
  },
];
