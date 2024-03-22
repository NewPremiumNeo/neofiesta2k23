exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};


exports.isAdminLoggedIn = (req, res, next) => {
  if (req.isAuthenticated() && req.session.isAdmin) {
    return next();
  }
  res.redirect('/admin/login');
};