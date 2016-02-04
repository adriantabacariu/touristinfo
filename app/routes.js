var config = require('../config/settings');
var async = require('async');
var User = require('../models/user');
var Place = require('../models/place');
var weather = require('./weather');
var weatherMapper = require('./weatherMapper');

module.exports = function (app, passport) {
  app.get('/', isLoggedIn, function (req, res) {
    res.render('index.ejs', {
      user: req.user
    });
  });

  app.get('/ajax/places', function (req, res, next) {
    Place.find({}, function (err, places) {
      if (err) {
        res.status(500).send('Something broke!');

        return next();
      }

      res.json(places);
    });
  });

  app.post('/ajax/places/filter', function (req, res, next) {
    var location = {
      $geoWithin: {
        $centerSphere: [
          [
            req.body.longitude,
            req.body.latitude
          ],
          req.body.radius / (req.body.distance === 'mi' ? 3963.2 : 6378.1)
        ]
      }
    };

    Place.find({ location: location }, function (err, places) {
      if (err) {
        res.status(500).send('Something broke!');

        return next();
      }

      res.json(places);
    });
  });

  app.post('/ajax/places/add', isLoggedIn, function (req, res, next) {
    if (req.user.username !== 'admin') {
      res.status(403).send('Forbidden!');

      return next();
    }

    var place = new Place({
      name: req.body.name,
      location: [
        req.body.longitude,
        req.body.latitude
      ]
    });

    if (req.body.description) {
      place.description = req.body.description
    }

    place.save(function (err) {
      if (err) {
        res.status(500).send('Something broke!');

        return next();
      }

      res.json(place._id);
    });
  });

  app.get('/ajax/places/:id', isLoggedIn, function (req, res, next) {
    var id = req.params.id;

    Place.findOne({ _id: id }, function (err, place) {
      if (err) {
        res.status(500).send('Something broke!');

        return next();
      }

      if (!place) {
        res.status(404).send('Place not found!');

        return next();
      }

      async.parallel([
        function (callback) {
          var params = {
            lat: place.latitude,
            lon: place.longitude
          };

          weather.currentWeather(params, function (data) {
            callback(null, data);
          });
        },
        function (callback) {
          var params = {
            lat: place.latitude,
            lon: place.longitude
          };

          weather.dailyForecast(params, function (data) {
            callback(null, data);
          });
        },
      ],
      function (err, results) {
        res.render('ajax/place.ejs', {
          dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          disqus: config.disqus,
          forecast: results[1],
          place: place,
          weather: results[0]
        });
      });
    });
  });

  // Weather API
  app.get('/api/weather', function (req, res) {
    var query = null;

    if (isValidWeatherRequestByName(req.query)) {
      query = {
        q: req.query.name
      };
    }

    if (!query && isValidWeatherRequestByCoordinates(req.query)) {
      query = req.query;
    }

    if (!query) {
      res.status(400).send('Bad request!');
    }

    weather.dailyForecast(query, function (data) {
      var response = weatherMapper.mapWeatherResponse(data);

      res.json(response);
    });
  });

  function isValidWeatherRequestByName(query) {
    return query && query.name;
  }

  function isValidWeatherRequestByCoordinates(query) {
    return query && query.lat && query.lon;
  }

  // Weather API - end

  app.get('/login', function (req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login', passport.authenticate('login', {
    failureFlash: true,
    failureRedirect: '/login',
    successRedirect: '/'
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
