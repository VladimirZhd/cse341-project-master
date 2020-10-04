const routes = require('express').Router();

routes
  .use('/ta01', require('./routes/ta01'))
  .use('/ta02', require('./routes/ta02'))
  .use('/ta03', require('./routes/ta03'))
  .use('/ta04', require('./routes/ta04'))
  .get('/', (req, res) => {
    res.render('pages', {
      title: 'Team Activities',
      path: '/team',
    });
  });

module.exports = routes;
