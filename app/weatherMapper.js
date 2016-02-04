(function () {
  exports.mapWeatherResponse = function (rawWeatherResponse) {
    return rawWeatherResponse.list.map(function (element) {
      return {
        description: element.weather[0].description,
        shortDescription: element.weather[0].main,
        timeOfData: element.dt,
        temperatureValues: {
          day: element.temp.day,
          night: element.temp.night
        },
        icon: element.weather[0].iconUrl
      };
    });
  };
})();
