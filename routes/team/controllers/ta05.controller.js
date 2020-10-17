exports.getTA05 = (req, res, next) => {
  req.session.style;
  req.session.counter;
  res.render('pages/team/ta05', {
    title: 'Team activity 05',
    path: '/team/ta05',
  });
};
