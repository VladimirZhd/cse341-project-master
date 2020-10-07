const routes = require('express').Router();

routes
  .use('/admin', require('./routes/admin'))
  .use('/shop', require('./routes/shop'))
  .get('/', (req, res) => {
    res.render('/pages/store/shop', {
      title: 'Your Store',
      path: '/store/shop',
    });
  });

module.exports = routes;
