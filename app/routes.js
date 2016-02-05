var weatherAdapter = require('./helpers/weatherAdapter');
var AuthenticationController = require('./controllers/authenticationController');
var UsersController = require('./controllers/usersController');
var WeatherController = require('./controllers/weatherController');
var PlacesController = require('./controllers/placesController');

module.exports = function (app, passport, ObjectId) {
  var authenticationController = new AuthenticationController(passport);
  var usersController = new UsersController();
  var weatherController = new WeatherController(weatherAdapter);
  var placesController = new PlacesController(weatherAdapter, ObjectId);

  app.get('/', usersController.isLoggedIn, function (req, res) {
    res.render('index.ejs', {
      user: req.user
    });
  });

  // Places
  app.get('/ajax/places', placesController.getPlaces);

  app.post('/ajax/places/filter', placesController.getPlacesAroundLocation);

  app.post('/ajax/places/add', usersController.isLoggedIn, placesController.insertPlace);

  app.get('/ajax/places/:id', usersController.isLoggedIn, placesController.getPlaceById);

  // Weather API
  app.get('/api/weather', weatherController.getWeatherInfo);

  // Authentication
  app.get('/login', usersController.getLoginView);

  app.post('/login', authenticationController.login, usersController.login);

  app.get('/join', usersController.getRegistrationView);

  app.post('/join', authenticationController.register);

  app.get('/logout', usersController.logout);
};
