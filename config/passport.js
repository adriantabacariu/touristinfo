var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use('join', new LocalStrategy({
    passReqToCallback: true,
    passwordField: 'password',
    usernameField: 'username'
  },
  function (req, username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (user) {
        return done(null, false, req.flash('joinMessage', 'Username already taken.'));
      }

      var newUser = new User({
        password: bcrypt.hashSync(password, null, null),
        username: username
      });

      newUser.save(function (err) {
        if (err) {
          return done(err);
        }

        return done(null, newUser);
      });
    });
  }));

  passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    passwordField: 'password',
    usernameField: 'username'
  },
  function (req, username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, req.flash('loginMessage', 'User not found.'));
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      }

      return done(null, user);
    });
  }));
};
