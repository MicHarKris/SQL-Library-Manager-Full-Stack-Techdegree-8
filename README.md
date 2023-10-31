# SQL-Library-Manager-Full-Stack-Techdegree-8
 Full-Stack-Techdegree - Project 8

A library database of books, that can be expanded and navigated by adding new books, deleting existing books, and searching for specific search terms, using SQL CRUD operations.

'In this project, you will build a web application that will include pages to list, add, update, and delete books. You'll be given HTML designs and an existing SQLite database. You'll be required to implement a dynamic website using JavaScript, Node.js, Express, Pug, SQLite and the SQL ORM Sequelize.'

Includes: 
Routes
 - Routes declared from the Index, to the Books list, and further has Routes for the CRUD operations of Creating Book Info, Reading Book Info, Updating Book Info, and Destroying Book Info - as well as a Search Route. 
 - Pagination for the main Index and the Search List on more than 10 books at a time.

.PUG
 - Views made for each of the unique pages; Index, Create Book, Edit Book and Search-For-Book, including a Page-Not-Found and 404 error pages.

Layout, CSS and Styles: 
 Changes made to the original style.css - changed the background to black, and added a yellow theme to buttons and text, and added some spacing and size changes to the buttons, to make them more uniform in type and look.
 -  a:hover {
        color: #66621F;
    }
 -  div {
        display: flex;  
        align-items: center;  
        justify-content: 
        flex-start;
    }
 -  .button {
        margin-right: 10px;
    }
 -  a.button, input[type=submit] {
        text-align: center;  
        margin-right: 50px;  
        padding: 10px 14px 12px; 
        display: inline-block;
        min-width: 150px;
    }
 -  form a.button, input[type=submit] {
        color: #0C0C0B;
        background: #FFF100;
    }
 -  input[type=submit] {
        min-width: 150px;
        font-weight: bold;
    }
 -  a.button:hover, input[type=submit]:hover {
        background-color: #66621F;
        min-width: 150px !important;
    }
 -  .search-button {  
        text-align: center;
        margin-right: 10px;
        color: #0C0C0B;
        background: #FFF100;
        font-family: "Lucida Grande", Helvetica, Arial, sans-serif;
        padding: 12px 0;
        font-size: 14px;
        border-radius: 2px;
        cursor: pointer;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        display: inline-block;
        min-width: 150px;
        font-weight: bold;
        border: 0;
        margin-left: 20px;
    }
 -  p {
        margin: 20px;
    }

 -  .pagination {
        display: flex;
    }
 -  .page-info {
        margin: 0 20px;
    }
 -  .page-numbers {
        list-style-type: none;
        display: flex;
    }
-   .page-number {
        margin: 0 5px;
    }

Note: The original Download files contained .jade files instead of .pug, and I have updated to the .pug format (also in the package.json dependencies, so that should work as intended). Also; the code may be a bit over-commented, but I am planning all of my projects with future references in mind, so I may have added more than was necessary (have yet to figure out how to add comments in .pug files though, but that hasn't been my main focus either.)