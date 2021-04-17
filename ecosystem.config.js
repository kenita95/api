module.exports = {
  apps: [
    {
      name: 'bug',
      script: './server.js',
      watch: true,
      env: {
        NODE_ENV: 'production',
        JWT_KEY: 'secret',
      },
    },
  ],
};
