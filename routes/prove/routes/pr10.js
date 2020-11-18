const express = require('express');
const router = express.Router();

// Path to your JSON file, although it can be hardcoded in this file.
const dummyData = require('../data/pr10.json');

router.get('/', (req, res, next) => {
  res.render('pages/prove/pr10', {
    title: 'Prove Activity 10',
    path: '',
    data: null,
  });
});

router.get('/fetchAll', (req, res, next) => {
  res.json(dummyData);
});

router.post('/insert', (req, res, next) => {
  /************************************************
   * INSERT YOUR WEB ENDPOINT CODE HERE
   ************************************************/
});

module.exports = router;
