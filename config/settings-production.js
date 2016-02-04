module.exports = {
  // Database settings
  db: {
    // Database connection
    connection: process.env.MONGOLAB_URI
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
