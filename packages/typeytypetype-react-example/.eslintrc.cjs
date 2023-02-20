module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'standard-with-typescript',
        'prettier',
        'plugin:import/recommended',
        'plugin:import/typescript',
        "@remix-run/eslint-config", 
        "@remix-run/eslint-config/node"
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    rules: {},
    settings: {
        'import/resolver': {
            typescript: true,
            node: true,
        },
    },
};
