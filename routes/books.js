const express = require('express');
const router = express.Router();
const { Book } = require('../models');

/* Handler function to wrap each route with error handling. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}

// GET /books - Shows the full list of books
router.get('/', asyncHandler(async (req, res) => {
  // Retrieve a list of books ordered by createdAt
  const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
  res.render('index', { books, title: "Books" });
}));

/* Create a new book form. */
router.get('/new', (req, res) => {
  // Render the form for creating a new book
  res.render("books/new-book", { book: {}, errors: [], title: 'New Book' });
});

/* POST created book. */
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    // Create a new book and redirect to its detail page
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // Handle validation errors when creating a book
      book = await Book.build(req.body);
      res.render("books/form-error", { book, errors: error.errors, title: "New Book" });
    } else {
      throw error; // Handle validation errors when creating a book, or re-throw other errors
    }
  }
}));

/* Shows book detail form. */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    // Render the book's detail page
    res.render("books/update-book", { book, title: book.title });
  } else {
    const err = new Error();
    err.status = 404;
    err.message = "Looks like the book you requested doesn't exist.";
    res.status(404).render('page-not-found', { err });
    throw err;
  }
}));

// Update book info in the database
router.post('/:id/edit', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      // Update book info and redirect to its detail page
      await book.update(req.body);
      res.redirect("/books/" + book.id);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // Handle validation errors when updating a book
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/form-error", { book, errors: error.errors, title: "Edit Book" });
    } else {
      throw error; // Handle validation errors when updating a book, or re-throw other errors
    }
  }
}));

// Delete book from the database
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    // Delete the book and redirect to the books listing
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));

// GET /books/search - Handles the search query
router.get('/search', asyncHandler(async (req, res) => {
  const { searchQuery } = req.query;

  if (!searchQuery || searchQuery.trim() === "") {
    console.log('No search query provided');
    // If the search query is empty, redirect to the main books page
    res.redirect('/books');
  } else {
    // Search for books that match the search query
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchQuery}%` } },
          { author: { [Op.like]: `%${searchQuery}%` } },
          { genre: { [Op.like]: `%${searchQuery}%` } },
          { year: { [Op.like]: `%${searchQuery}%` } }
        ]
      },
      order: [["createdAt", "DESC"]]
    });

    res.render('search-for-book', { books, title: `Search Results for "${searchQuery}"` });
  }
}));

module.exports = router;
