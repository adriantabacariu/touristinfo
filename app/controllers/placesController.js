(function () {
  var async = require('async');
  var config = require('../../config/settings');
  var Place = require('../../models/place');

  /**
  * PlacesController module that exposes 
  * methods for retrieving and manipulating places and locations.
  * @constructor
  */
  module.exports = function (weatherAdapter, ObjectId) {
    var self = this;

    /**
    * Get all the places.
    * @function
    * @param {object} req - The request.
    * @param {object} res - The response.
    * @param {function} next - The next handler for this expressJs route.
    * @memberOf placesController
    */
    self.getPlaces = function (req, res, next) {
      Place.find({}, function (err, places) {
        if (err) {
          res.status(500).send('An error occured while trying to find the places!');

          return next();
        }

        res.json(places);
      });
    };

    /**
    * Get all the places around a location in a given radius.
    * @function
    * @param {object} req - The request.
    * @param {object} res - The response.
    * @param {function} next - The next handler for this expressJs route.
    * @memberOf placesController
    */
    self.getPlacesAroundLocation = function (req, res, next) {
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
          res.status(500).send('An error occured while trying to find places around that location!');

          return next();
        }

        res.json(places);
      });
    };

    /**
    * Add a location to the database.
    * @function
    * @param {object} req - The request.
    * @param {object} res - The response.
    * @param {function} next - The next handler for this expressJs route.
    * @memberOf placesController
    */
    self.insertPlace = function (req, res, next) {
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
          res.status(500).send('An error occured while trying to save this place!');

          return next();
        }

        res.json(place._id);
      });
    };

    /**
    * Get the place for a given id.
    * @function
    * @param {object} req - The request.
    * @param {object} res - The response.
    * @param {function} next - The next handler for this expressJs route.
    * @memberOf placesController
    */
    self.getPlaceById = function (req, res, next) {
      var id = req.params.id;

      Place.findOne({ _id: new ObjectId(id) }, function (err, place) {
        if (err) {
          res.status(500).send('An error occured while trying to find this place!');

          return next();
        }

        if (!place) {
          res.status(404).send('Place not found!');

          return next();
        }

        async.parallel([
          function (callback) {
            var params = {
              lon: place.location[0],
              lat: place.location[1],
            };

            weatherAdapter.currentWeather(params, function (data) {
              callback(null, data);
            });
          },
          function (callback) {
            var params = {
              lon: place.location[0],
              lat: place.location[1]
            };

            weatherAdapter.dailyForecast(params, function (data) {
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
    };
  };
} ());