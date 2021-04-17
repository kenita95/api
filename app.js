const express = require('express');

const app = express();

// import essential libraries

const morgan = require('morgan');
const bodyParser = require('body-parser');

// use imported libraries

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

// prevent cors errors

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET');
    return res.status(200).json({});
  }
  next();
});

const routes = require('./src/controllers/index');

routes.forEach(([name, handler]) => app.use(`/api/${name}`, handler));

app.use((req, res) => {
  res.sendStatus(404);
});

module.exports = app;
