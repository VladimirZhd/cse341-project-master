const routes = require('express').Router();

routes
  .use('/admin', require('./routes/admin'))
  .use('/shop', require('./routes/shop'))
  .get('/', (req, res, next) => {
    res.redirect('/store/shop');
    next();
  });

module.exports = routes;
