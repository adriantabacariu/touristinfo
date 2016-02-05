(function () {
  module.exports = function () {
    var self = this;

    self.getRegistrationView = function (req, res) {
      res.render('join.ejs', {
        message: req.flash('joinMessage')
      });
    };

    self.getLoginView = function (req, res) {
      res.render('login.ejs', {
        message: req.flash('loginMessage')
      });
    };

    self.login = function (req, res) {
      if (req.body.remember) {
        req.session.cookie.maxAge = 5 * 60 * 1000;
      } else {
        req.session.cookie.expires = false;
      }

      res.redirect('/');
    };

    self.logout = function (req, res) {
      req.logout();
      res.redirect('/');
    };

    self.isLoggedIn = function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }

      res.redirect('/login');
    };
  };
} ());