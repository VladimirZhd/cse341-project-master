module.exports = (req, res, next) => {
  if (req.user.level !== 1) {
    return res.redirect('/store');
  }
  next();
};
