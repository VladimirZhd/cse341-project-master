const path = require('path');
const fs = require('fs');

const filePath = path.join(path.dirname(require.main.filename), 'routes/prove/data', 'pr08.json');
let index = 0;
let size = 10;

exports.getProve08 = async (req, res, next) => {
  let data = await fs.readFileSync(filePath);
  data = JSON.parse(data);
  const pages = data.length / 10;
  const chunk = data.slice(index, size);
  res.render('pages/prove/pr08', {
    title: 'Prove Week 8',
    path: 'pr08',
    data: chunk,
    nextDisable: false,
    prevDisable: true,
    pages: Math.ceil(pages),
  });
};

exports.getNext = async (req, res, next) => {
  index += 10;
  size += 10;
  let data = await fs.readFileSync(filePath);
  data = JSON.parse(data);
  const pages = data.length / 10;
  if (size <= data.length) {
    let chunk = data.slice(index, size);
    res.render('pages/prove/pr08', {
      title: 'Prove Week 8',
      path: 'pr08',
      data: chunk,
      nextDisable: false,
      prevDisable: false,
      pages: Math.ceil(pages),
    });
  } else {
    let chunk = data.slice(index);
    res.render('pages/prove/pr08', {
      title: 'Prove Week 8',
      path: 'pr08',
      data: chunk,
      nextDisable: true,
      prevDisable: false,
      pages: Math.ceil(pages),
    });
  }
};

exports.getPrev = async (req, res, next) => {
  index -= 10;
  size -= 10;
  let data = await fs.readFileSync(filePath);
  data = JSON.parse(data);
  const pages = data.length / 10;
  if (index <= 10) {
    let chunk = data.slice(0, 10);
    res.render('pages/prove/pr08', {
      title: 'Prove Week 8',
      path: 'pr08',
      data: chunk,
      nextDisable: false,
      prevDisable: true,
      pages: Math.ceil(pages),
    });
  } else {
    let chunk = data.slice(index, size);
    res.render('pages/prove/pr08', {
      title: 'Prove Week 8',
      path: 'pr08',
      data: chunk,
      nextDisable: false,
      prevDisable: false,
      pages: Math.ceil(pages),
    });
  }
};

exports.getPage = async (req, res, next) => {
  const pageNumber = req.params.id;
  let data = await fs.readFileSync(filePath);
  data = JSON.parse(data);
  const pageIndex = pageNumber * 10;
  const pages = data.length / 10;
  const chunk = data.slice(pageIndex, pageIndex + 10);
  res.render('pages/prove/pr08', {
    title: 'Prove Week 8',
    path: 'pr08',
    data: chunk,
    nextDisable: false,
    prevDisable: false,
    pages: Math.ceil(pages),
  });
};
