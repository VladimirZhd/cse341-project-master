const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to your JSON file, although it can be hardcoded in this file.
const dummyData = require('../data/pr10.json');
const filePath = path.join(path.dirname(require.main.filename), 'routes/prove/data', 'pr10.json');

router.get('/', (req, res, next) => {
  res.render('pages/prove/pr10', {
    title: 'Prove Activity 10',
    path: '',
    data: null,
  });
});

router.get('/fetchAll', async (req, res, next) => {
  let array = await fs.readFileSync(filePath);
  array = JSON.parse(array);
  res.status(200).json(array);
});

router.post('/insert', async (req, res, next) => {
  const text = req.body.name;
  let array = await fs.readFileSync(filePath);
  array = JSON.parse(array);
  array.avengers.push({
    name: text,
  });
  fs.writeFile(filePath, JSON.stringify(array), err => {
    if (err) {
      throw new Error(err);
    }
    console.log('Data Written');
  });
  next();
});

module.exports = router;
