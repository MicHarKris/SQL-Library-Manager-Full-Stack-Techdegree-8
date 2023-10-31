'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  // Define the Book model
  class Book extends Sequelize.Model { }

  // Initialize the Book model with attributes and validations
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false, // Title cannot be null
      validate: {
        notEmpty: { msg: 'Title is required' }
      }
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false, // Author cannot be null
      validate: {
        notEmpty: { msg: 'Author is required' }
      }
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, {
    timestamps: true, // Include createdAt and updatedAt timestamps
    sequelize,         // Use the provided Sequelize instance
  });

  return Book; // Export the Book model
};
