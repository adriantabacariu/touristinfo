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

    // Database collections
    collections: {
      users: 'users',
      places: 'places'
    },
    
    // Database connection
    mongoUri: 'mongodb://localhost:27017/touristinfo'
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
