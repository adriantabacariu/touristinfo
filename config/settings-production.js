module.exports = {
  // Database settings
  db: {
    // Database connection
    connection: process.env.MONGOLAB_URI,
    mongoUri: 'mongodb://localhost:27017/touristinfo',

    // Database collections
    collections: {
      users: 'users',
      places: 'places'
    }
  },

  // OpenWeatherMap settings
  openweathermap: {
    appid: process.env.OPENWEATHERMAP_APPID
  },

  // Disqus settings
  disqus: {
    shortname: process.env.DISQUS_SHORTNAME
  }
};
