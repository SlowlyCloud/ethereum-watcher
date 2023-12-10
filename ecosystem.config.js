module.exports = {
    apps: [
        {
            name: 'application',
            script: './dist/main.js',
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
