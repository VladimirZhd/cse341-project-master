const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/prove/pr01/index', {
    title: 'Prove Activity 1',
    path: '/pr01', // For pug, EJS
    activeTA03: true, // For HBS
    contentCSS: true, // For HBS
  });
});

router.post('/submit', (req, res) => {
  res.render('pages/prove/pr01/display', {
    title: 'Prove Activity 1',
    path: '/pr01',
    firstInput: req.body.input1,
    secondInput: req.body.input2,
  });
});

module.exports = router;
