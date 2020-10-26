exports.get404 = (req, res, next) => {
  res.status(404).render('pages/store/404', {
    pageTitle: 'Page Not Found',
    path: '/store/404',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('pages/store/500', {
    pageTitle: 'Error!',
    path: '/store/500',
    isAuthenticated: req.session.isLoggedIn,
  });
};
