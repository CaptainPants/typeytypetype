module.exports = {
    env: {
    },
    extends: [
        '../../.eslintrc.cjs',
    ],
    overrides: [],
    parserOptions: {
    },
    rules: {
        "@grncdr/react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
        "@grncdr/react-hooks/exhaustive-deps": [
            "error",
            {
                //"additionalHooks": ""
            }
        ]
    },
    settings: {
    },
    plugins: [
        "@grncdr/react-hooks"
    ],
};
