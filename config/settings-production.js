module.exports = {
  // Database settings
  db: {
    // Database connection
    connection: process.env.CLEARDB_DATABASE_URL,

    // Database tables
    tables: {
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
