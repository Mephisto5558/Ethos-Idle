import config, { globals, plugins } from '@mephisto5558/eslint-config';

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 * This config lists all rules from every plugin it uses. */
export default [
  ...config,
  {
    ignores: ['js/**', 'min/**']
  },
  {
    name: 'overwrite',
    files: ['**/*'],
    languageOptions: {
      globals: {
        ...globals.es2024,
        ...globals.browser
      }
    },
    rules: {
      'import-x/extensions': 'off' // the browser requires them
    },
    plugins
  }
];