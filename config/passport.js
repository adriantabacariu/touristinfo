var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
var LocalStrategy = require('passport-local').Strategy;

connection.query('USE ' + dbconfig.database);

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    connection.query('SELECT * FROM users WHERE id = ?', [id], function (err, rows) {
      done(err, rows[0]);
    });
  });

  passport.use('join', new LocalStrategy({
    passReqToCallback: true,
    passwordField: 'password',
    usernameField: 'username'
  },
  function (req, username, password, done) {
    connection.query('SELECT * FROM users WHERE username = ?', [username], function (err, rows) {
      if (err) {
        return done(err);
      }

      if (rows.length) {
        return done(null, false, req.flash('joinMessage', 'Username already taken.'));
      } else {
        var newUserMysql = {
          password: bcrypt.hashSync(password, null, null),
          username: username
        };

        var insertQuery = 'INSERT INTO users (username, password) values (?, ?)';

        connection.query(insertQuery, [newUserMysql.username, newUserMysql.password], function (err, rows) {
          newUserMysql.id = rows.insertId;

          return done(null, newUserMysql);
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
    connection.query('SELECT * FROM users WHERE username = ?', [username], function (err, rows) {
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
