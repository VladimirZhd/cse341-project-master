module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/store/auth/login');
  }
  next();
};
