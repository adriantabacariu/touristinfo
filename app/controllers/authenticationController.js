(function () {
  module.exports = function (passport) {
    var self = this;

    self.login = passport.authenticate('login', {
      failureFlash: true,
      failureRedirect: '/login',
      successRedirect: '/'
    });

    self.register = passport.authenticate('join', {
      failureFlash: true,
      failureRedirect: '/join',
      successRedirect: '/'
    });
  };
} ());