const routes = require('express').Router();

routes
  .use('/pr01', require('./routes/prove01'))
  .use('/pr02', require('./routes/pr02'))
  .use('/pr08', require('./routes/pr08'))
  .use('/pr09', require('./routes/pr09'))
  .use('/pr10', require('./routes/pr10'))
  .get('/', (req, res) => {
    res.render('pages/prove', {
      title: 'Prove Assignments',
      path: '/prove',
    });
  });

module.exports = routes;
