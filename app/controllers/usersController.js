/**
 * The UsersController module.
 * @module usersController
 */
(function () {
  /**
  * UsersController module that exposes pre and 
  * post passportJs actions.
  * @constructor
  */
  module.exports = function usersController() {
    /**
    * Get the registration view.
    * @function
    * @param {object} req - The request.
    * @param {object} res - The response.
    * @alias module:usersController#getRegistrationView
    */
    this.getRegistrationView = function (req, res) {
      res.render('join.ejs', {
        message: req.flash('joinMessage')
      });
    };

    /**
    * Get the login view.
    * @function
    * @param {object} req - The request.
    * @param {object} res - The response.
    * @alias module:usersController#getLoginView
    */
    this.getLoginView = function (req, res) {
      res.render('login.ejs', {
        message: req.flash('loginMessage')
      });
    };

    /**
    * Method called after login successful, saves the session cookie
    * and redirects to index.
    * @function
    * @param {object} req - The request.
    * @param {object} res - The response.
    * @alias module:usersController#login
    */
    this.login = function (req, res) {
      if (req.body.remember) {
        req.session.cookie.maxAge = 5 * 60 * 1000;
      } else {
        req.session.cookie.expires = false;
      }

      res.redirect('/');
    };

    /**
    * Performs the logout and redirects to index.
    * @function
    * @param {object} req - The request.
    * @param {object} res - The response.
    * @alias module:usersController#logout
    */
    this.logout = function (req, res) {
      req.logout();
      res.redirect('/');
    };

    /**
    * Method used to determine if the request sender is authenticated, 
    * required for elevated permissions actions.
    * @function
    * @param {object} req - The request.
    * @param {object} res - The response.
    * @param {function} next - The next handler for this expressJs route.
    * @alias module:usersController#isLoggedIn
    */
    this.isLoggedIn = function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }

      res.redirect('/login');
    };
  };
} ());