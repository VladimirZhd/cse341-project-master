const fs = require('fs');
const path = require('path');
const filePath = path.join(path.dirname(require.main.filename), 'routes/store/data', 'products.json');

const getProductsFromFile = cb => {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      cb([]);
    }
    cb(JSON.parse(content));
  });
};

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products), err => console.log(err));
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};