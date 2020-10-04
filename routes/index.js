const routes = require('express').Router();

const proveRoute = require('./prove');
const classwork = require('./classwork/carsExample');
const teamActivities = require('./team');
const store = require('./store');

routes
  .use('/prove', proveRoute)
  .use('/classwork', classwork)
  .use('/team', teamActivities)
  .use('/store', store)
  .get('/', (req, res, next) => {
    // This is the primary index, always handled last.
    res.render('pages/index', {
      title: 'Welcome to my CSE341 repo',
      path: '/',
    });
  })
  .use((req, res, next) => {
    // 404 page
    res.render('pages/404', { title: '404 - Page Not Found', path: req.url });
  });

module.exports = routes;
