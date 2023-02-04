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
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    rules: {
        'typescript-eslint/promise-function-async': ['Off'],
    },
    settings: {
        'import/resolver': {
            typescript: true,
            node: true,
        },
    },
};
