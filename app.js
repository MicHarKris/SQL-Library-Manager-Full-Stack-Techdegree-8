var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

// Import the Sequelize instance for database operations
const { sequelize } = require('./models');

var app = express();

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware for handling request data and logging
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Check if the database connection is established
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Sync the models with the database
sequelize.sync()
  .then(() => {
    console.log('All models are synchronized with the database.');
  })
  .catch((err) => {
    console.error('Error syncing models with the database:', err);
  });

// Routes setup
app.use('/', indexRouter);
app.use('/books', booksRouter);

// 404 handler
app.use(function(req, res, next) {
  const err = new Error('Page Not Found');
  err.status = 404;
  res.status(404).render('page-not-found', { err });
});

// Global error handler
app.use(function(err, req, res, next) {
  err.status = err.status || 500;
  err.message = err.message || 'Something went wrong. Please try again.';
  console.error(`Error Status: ${err.status}`);
  console.error(`Error Message: ${err.message}`);
  res.status(err.status).render('error', { err });
});

module.exports = app;
