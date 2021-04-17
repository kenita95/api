const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

// server.listen(port);
server.listen(port, () => {
  console.log(`PORT ${port} ${process.env.NODE_ENV} ${process.env.JWT_KEY}`);
});
