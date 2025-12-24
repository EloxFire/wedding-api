module.exports = {
  apps: [
    {
      name: 'wedding-api-prod',
      script: 'node dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3004
      },
    },
    {
      name: 'wedding-api-dev',
      script: 'node dist/index.js',
      env: {
        NODE_ENV: 'development',
        PORT: 3003
      },
    },
  ],
};