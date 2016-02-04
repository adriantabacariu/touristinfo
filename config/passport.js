var config = require('./settings');
var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var usersRepository = require('../app/repositories/usersRepository');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    usersRepository.executeDbQuery(usersRepository.findUserById, { id: id }, done);
  });

  passport.use('join', new LocalStrategy({
    passReqToCallback: true,
    passwordField: 'password',
    usernameField: 'username'
  },
    function (req, username, password, done) {
      usersRepository.executeDbQuery(usersRepository.findUserByName, { username: username }, function (err, rows) {
        if (err) {
          return done(err);
        }

        if (rows.length) {
          return done(null, false, req.flash('joinMessage', 'Username already taken.'));
        } else {
          var userToInsert = {
            password: password,
            username: username
          };

          usersRepository.executeDbQuery(usersRepository.insertUser, userToInsert, function (err, rows) {
            userToInsert.id = rows.insertId;
            return done(null, userToInsert);
          });
        }
      });
    }));

  passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    passwordField: 'password',
    usernameField: 'username'
  },
    function (req, username, password, done) {
      usersRepository.executeDbQuery(usersRepository.findUserByName, { username: username }, function (err, rows) {
        if (err) {
          return done(err);
        }

        if (!rows.length) {
          return done(null, false, req.flash('loginMessage', 'User not found.'));
        }

        if (!bcrypt.compareSync(password, rows[0].password)) {
          return done(null, false, req.flash('loginMessage', 'Wrong password.'));
        }

        return done(null, rows[0]);
      });
    }));
};
