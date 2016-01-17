var dbconfig = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function (app, passport) {
  app.get('/', isLoggedIn, function(req, res) {
    res.render('index.ejs', {
      user: req.user
    });
  });

  app.get('/ajax/forecast/:latitude/:longitude', isLoggedIn, function (req, res) {
    var latitude = req.params.latitude;
    var longitude = req.params.longitude;
    var forecast = {};

    res.render('ajax/forecast.ejs', {
      forecast: forecast
    });
  });

  app.get('/ajax/places', function (req, res) {
    connection.query('SELECT * FROM places', function (err, rows) {
      if (err) {
        res.status(500).send('Something broke!');
      }

      res.send(JSON.stringify(rows));
    });
  });

  app.get('/login', function (req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login', passport.authenticate('login', {
    failureFlash : true,
    failureRedirect : '/login',
    successRedirect : '/'
  }),
  function (req, res) {
    if (req.body.remember) {
      req.session.cookie.maxAge = 5 * 60 * 1000;
    } else {
      req.session.cookie.expires = false;
    }

    res.redirect('/');
  });

  app.get('/join', function (req, res) {
    res.render('join.ejs', {
      message: req.flash('joinMessage')
    });
  });

  app.post('/join', passport.authenticate('join', {
    failureFlash: true,
    failureRedirect: '/join',
    successRedirect: '/'
  }));

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}
