/**
 * The WeatherController module.
 * @module weatherController
 */
(function () {
  var weatherMapper = require('../helpers/weatherMapper');
  
  /**
  * WeatherController module that exposes weather info 
  * in a json format.
  * @constructor
  */
  module.exports = function weatherController(weatherAdapter) {
    /**
    * Get the weather information for a set of coordinates or location name.
    * Part of the weather api called by the mobile application.
    * @function
    * @param {object} req - The request.
    * @param {object} res - The response.
    * @alias module:weatherController#getWeatherInfo
    */
    this.getWeatherInfo = function (req, res) {
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

      weatherAdapter.dailyForecast(query, function (data) {
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