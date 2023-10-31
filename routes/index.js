var express = require('express');
var router = express.Router();

/* Redirect to the '/books' page when accessing the home page. */
router.get('/', function (req, res, next) {
  res.redirect("/books");
});

module.exports = router;
