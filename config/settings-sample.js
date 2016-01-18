module.exports = {
  // Database settings
  db: {
    // Database connection
    connection: {
      host: 'localhost',
      user: '',
      password: '',
      database: 'touristinfo'
    },

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
