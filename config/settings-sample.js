module.exports = {
  // Database settings
  db: {
    // Database connection
    connection: 'mysql://username:password@localhost/touristinfo?reconnect=true',

    // Database tables
    tables: {
      users: 'users',
      places: 'places'
    }
  },

  // OpenWeatherMap settings
  openweathermap: {
    appid: ''
  },

  // Disqus settings
  disqus: {
    shortname: ''
  }
};
