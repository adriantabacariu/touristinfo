var weather = require('./weather');
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

  app.get('/ajax/places', function (req, res, next) {
    connection.query('SELECT * FROM places', function (err, rows) {
      if (err) {
        res.status(500).send('Something broke!');

        return next();
      }

      res.send(JSON.stringify(rows));
    });
  });

  app.post('/ajax/places/add', isLoggedIn, function (req, res, next) {
    if (req.user.id !== 1) {
      res.status(403).send('Forbidden!');

      return next();
    }

    connection.query('INSERT INTO places VALUES (NULL, ?, ?, ?, ?)', [
      req.body.name, req.body.latitude, req.body.longitude, req.body.description || null
    ],
    function (err, rows) {
      if (err) {
        res.status(500).send('Something broke!');

        return next();
      }

      res.send(JSON.stringify(rows.insertId));
    });
  });

  app.get('/ajax/places/:id', isLoggedIn, function (req, res, next) {
    var id = req.params.id;

    connection.query('SELECT * FROM places WHERE id = ?', [id], function (err, rows) {
      if (err) {
        res.status(500).send('Something broke!');

        return next();
      }

      if (!rows.length) {
        res.status(404).send('Something broke!');

        return next();
      }

      var query = {
        lat: rows[0].latitude,
        lon: rows[0].longitude
      };

      weather.dailyForecast(query, function (data) {
        res.render('ajax/place.ejs', {
          dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          description: rows[0].description,
          forecast: data.list,
          name: rows[0].name
        });
      });
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
