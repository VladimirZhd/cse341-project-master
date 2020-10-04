const routes = require('express').Router();

routes
  .use('/pr01', require('./routes/prove01'))
  .use('/pr02', require('./routes/pr02'))
  .get('/', (req, res) => {
    res.render('pages/prove', {
      title: 'Prove Assignments',
      path: '/prove',
    });
  });

module.exports = routes;
