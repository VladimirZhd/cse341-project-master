const routes = require('express').Router();
const errorController = require('./controllers/error');

routes
  .use('/admin', require('./routes/admin'))
  .use('/shop', require('./routes/shop'))
  .use('/auth', require('./routes/auth'))
  .get('/500', errorController.get500)
  .get('/', (req, res, next) => {
    res.redirect('/store/shop');
  })
  .use(errorController.get404)
  .use((error, req, res, next) => {
    res.redirect('/store/500');
  });

module.exports = routes;
