(function () {
  /**
  * AuthenticationController module that exposes 
  * passportJs authentication and registration capabilities.
  * @constructor
  */
  module.exports = function (passport) {
    var self = this;

    /**
    * Performs login with passportJs and redirects to index 
    * in case of success or back to login otherwise.
    * @function
    * @memberOf authenticationController
    */
    self.login = passport.authenticate('login', {
      failureFlash: true,
      failureRedirect: '/login',
      successRedirect: '/'
    });
    
    /**
    * Performs registration with passportJs and redirects to index 
    * in case of success or back to login otherwise.
    * @function
    * @memberOf authenticationController
    */
    self.register = passport.authenticate('join', {
      failureFlash: true,
      failureRedirect: '/join',
      successRedirect: '/'
    });
  };
} ());