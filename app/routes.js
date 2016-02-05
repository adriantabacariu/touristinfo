/**
 * The expressJs routing module.
 * @module routes
 */

var weatherAdapter = require('./helpers/weatherAdapter');
var AuthenticationController = require('./controllers/authenticationController');
var UsersController = require('./controllers/usersController');
var WeatherController = require('./controllers/weatherController');
var PlacesController = require('./controllers/placesController');

/**
* Routes module that facilitates routing mechanism through expressJs.
* @constructor
*/
module.exports = function routes(app, passport, ObjectId) {
  var authenticationController = new AuthenticationController(passport);
  var usersController = new UsersController();
  var weatherController = new WeatherController(weatherAdapter);
  var placesController = new PlacesController(weatherAdapter, ObjectId);

  /**
  * Get the index view.
  */
  app.get('/', usersController.isLoggedIn, function (req, res) {
    res.render('index.ejs', {
      user: req.user
    });
  });

  /**
  * Get all the places.
  */
  app.get('/ajax/places', placesController.getPlaces);

  /**
  * Get all the places around a location in a given radius.
  */
  app.post('/ajax/places/filter', placesController.getPlacesAroundLocation);

  /**
  * Add a location to the database.
  */
  app.post('/ajax/places/add', usersController.isLoggedIn, placesController.insertPlace);

  /**
  * Get the place for a given id.
  */
  app.get('/ajax/places/:id', usersController.isLoggedIn, placesController.getPlaceById);

  /**
  * Get the weather information for a set of coordinates or location name.
  * Part of the weather api called by the mobile application.
  */
  app.get('/api/weather', weatherController.getWeatherInfo);

  /**
  * Get the login view.
  */
  app.get('/login', usersController.getLoginView);

  /**
  * Represents the login for the application.
  */
  app.post('/login', authenticationController.login, usersController.login);

  /**
  * Get the registration view.
  */
  app.get('/join', usersController.getRegistrationView);

  /**
  * Represents the register for the application.
  */
  app.post('/join', authenticationController.register);

  /**
  * Used for loging out of the application.
  */
  app.get('/logout', usersController.logout);
};
