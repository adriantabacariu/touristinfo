(function () {
  var weatherMapper = require('../weatherMapper');
  module.exports = function (weather) {
    var self = this;

    self.getWeatherInfo = function (req, res) {
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
    };

    function isValidWeatherRequestByName(query) {
      return query && query.name;
    }

    function isValidWeatherRequestByCoordinates(query) {
      return query && query.lat && query.lon;
    }
  };
} ());