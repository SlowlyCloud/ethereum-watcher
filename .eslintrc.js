/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ['@nnmax/eslint-config-typescript', 'prettier'],
    parserOptions: {
        project: './tsconfig.eslint.json',
    },
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: './tsconfig.eslint.json',
            },
        },
    },
};
