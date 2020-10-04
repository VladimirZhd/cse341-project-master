const express = require('express');
const router = express.Router();

const books = [
  {
    bookTitle: 'Python Crash Course, 2nd Edition: A Hands-On, Project-Based Introduction to Programming',
    summary:
      "Python Crash Course is the world's best-selling guide to the Python programming language. This fast-paced, thorough introduction to programming with Python will have you writing programs, solving problems, and making things that work in no time.",
    author: 'Eric Matthes',
    year: 'May 3, 2019',
  },
];

let emptyFields = false;
router.get('/', (req, res) => {
  res.render('pages/prove/pr02/books', {
    title: 'Prove assignment 2',
    path: '/pr02',
    books: books,
    empty: emptyFields,
  });
});

router.post('/addBook', (req, res) => {
  if (!req.body.bookTitle || !req.body.summary || !req.body.author || !req.body.year) {
    emptyFields = true;
    return res.redirect('/pr02');
  }
  emptyFields = false;
  books.push(req.body);
  res.redirect('/pr02');
});

module.exports = router;
