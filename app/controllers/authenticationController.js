/**
 * The AuthenticationController module.
 * @module authenticationController
 */
(function () {
  /**
  * AuthenticationController module that exposes 
  * passportJs authentication and registration capabilities.
  * @constructor
  */
  module.exports = function authenticationController(passport) {
    /**
    * Performs login with passportJs and redirects to index 
    * in case of success or back to login otherwise.
    * @function
    * @alias module:authenticationController#login
    */
    this.login = passport.authenticate('login', {
      failureFlash: true,
      failureRedirect: '/login',
      successRedirect: '/'
    });
    
    /**
    * Performs registration with passportJs and redirects to index 
    * in case of success or back to login otherwise.
    * @function
    * @alias module:authenticationController#register
    */
    this.register = passport.authenticate('join', {
      failureFlash: true,
      failureRedirect: '/join',
      successRedirect: '/'
    });
  };
} ());