const express = require('express');
const { sequelize } = require('../models'); // Import the Sequelize instance
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

// GET /books - Shows the full list of books with pagination
router.get('/', asyncHandler(async (req, res) => {
  // Parse the 'page' and 'perPage' query parameters, or use default values
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  // Calculate the offset for pagination
  const offset = (page - 1) * perPage;

  // Use Sequelize's 'findAndCountAll' to fetch books with pagination
  const { count, rows: books } = await Book.findAndCountAll({
    offset,
    limit: perPage,
    order: [['createdAt', 'DESC']],
  });

  // Calculate the total number of pages for pagination
  const totalPages = Math.ceil(count / perPage);

  // Render the 'index' template with fetched books and pagination information
  res.render('index', {
    books,
    title: 'Books',
    totalPages,
    currentPage: page,
  });
}));

/* Create a new book form. */
router.get('/new', (req, res) => {
  // Render the form for creating a new book
  res.render("books/new-book", { book: {}, errors: [], title: 'New Book' });
});

// GET /books/search - Handles the search query
router.get('/search', asyncHandler(async (req, res) => {
  console.log('search Path');
  const { searchQuery } = req.query;
  const perPage = parseInt(req.query.perPage) || 10; // Default to 10 items per page
  const page = parseInt(req.query.page) || 1; // Default to page 1

  if (!searchQuery || searchQuery.trim() === "") {
    // If the search query is empty or contains only whitespace, render a search results page with no results.
    res.render('books/search-for-book', { books: [], title: 'No Matching Books', totalPages: 1, currentPage: 1, perPage, searchQuery: '' }); // Pass an empty searchQuery here
  } else {
    // Define the raw SQL query to perform a case-insensitive search
    const query = `
      SELECT * FROM Books
      WHERE title LIKE :searchQuery
      OR author LIKE :searchQuery
      OR genre LIKE :searchQuery
      OR year LIKE :searchQuery
      ORDER BY createdAt DESC
    `;

    // Execute the raw SQL query with the searchQuery parameter
    const books = await sequelize.query(query, {
      replacements: { searchQuery: `%${searchQuery}%` },
      type: sequelize.QueryTypes.SELECT
    });

    const totalCount = books.length;
    const totalPages = Math.ceil(totalCount / perPage);

    // Slice the books array to display only the current page
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const booksForPage = books.slice(startIndex, endIndex);

    // Render the search results with pagination data
    res.render('books/search-for-book', {
      books: booksForPage,
      title: `Search Results for "${searchQuery}"`,
      totalPages,
      currentPage: page,
      perPage,
      searchQuery, // Pass the searchQuery to the template
    });
  }
}));



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

module.exports = router;
