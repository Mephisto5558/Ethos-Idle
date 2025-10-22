import config, { globals } from '@mephisto5558/eslint-config';

/**
 * @type {typeof config}
 * This config lists all rules from every plugin it uses. */
export default [
  ...config,
  {
    ignores: ['min/**']
  },
  {
    name: 'overwrite',
    files: ['**/*'],
    languageOptions: {
      globals: {
        ...globals.es2024,
        ...globals.browser
      }
    }
  }
];