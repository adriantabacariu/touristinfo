var config = require('../config/settings');

(function () {
	//queryEx: var query = {id: 524901};
	//Forecast: 5 days every 3 hours
	exports.forecast = function (query, callback) {
		var openWeatherPath = "/data/2.5/forecast?";
		doListQuery(query, openWeatherPath, callback);
	};

	//queryEx: var query = {id: 524901};
	//Forecast: 16 days daily forecast
	exports.dailyForecast = function (query, callback) {
		var openWeatherPath = "/data/2.5/forecast/daily?";
		doListQuery(query, openWeatherPath, callback);
	};

	//queryEx: var query = {id: 524901};
	//Find: current weather for city
	exports.currentWeather = function (query, callback) {
		var openWeatherPath = "/data/2.5/weather?";
		doListQuery(query, openWeatherPath, callback);
	};

	//queryEx: var query = {bbox: '12,32,15,37,10'};
	//Box: current weather for in a rectangle
	exports.currentWeatherInBox = function (query, callback) {
		var openWeatherPath = "/data/2.5/box/city?";
		query.cluster = 'yes';
		doListQuery(query, openWeatherPath, callback);
	};

	//queryEx: var query = {lat:55.5, lon:37.5, cnt:10};
	//Find: current weather for in a circle from the center point
	exports.currentWeatherInCircle = function (query, callback) {
		var openWeatherPath = "/data/2.5/find?";
		doListQuery(query, openWeatherPath, callback);
	};


	var http = require("http");
	var url = require('url');

	var weatherConfig = {
		host: 'api.openweathermap.org',
		port: 80,
		withCredentials: false
	};

	var weatherImgBasePath = 'http://openweathermap.org/img/w/';
	var appId = config.openweathermap.appid;

	function doListQuery(query, openWeatherPath, callback) {
		query.units = 'metric';
		query.appId = appId;
		openWeatherPath += buildQueryFromObject(query);
		weatherConfig.path = openWeatherPath;
		getWeather(weatherConfig, function onSuccess(response) {
			var list = response.list;
			var currentIndex = list.length;

			var listItem;
			while (currentIndex--) {
				listItem = list[currentIndex];
				listItem.weather[0].iconUrl = "" + weatherImgBasePath + listItem.weather[0].icon + ".png";
			}
			callback(response);
		}, function onError(error) {
			console.log(error);
			callback(error);
		});
	};

	function buildQueryFromObject(jsObject) {
		var value;
		var query = '';

		for (var key in jsObject) {
			value = jsObject[key];
			query += key + "=" + value + "&";
		}
		return query.slice(0, -1);
	};

	function getWeather(weatherRequest, successFn, errorFn) {
		return http.get(weatherRequest, function (weatherResponse) {
			var tempBuffer = '';

			weatherResponse.on('data', function (data) {
				return tempBuffer += data;
			});
			weatherResponse.on('error', function (error) {
				return errorFn(error);
			});
			return weatherResponse.on('end', function () {
				var response;
				try {
					response = JSON.parse(tempBuffer);
				} catch (exception) {
					return errorFn(exception);
				}

				if (response.list == null) {
					response.list = [];
				}
				return successFn(response);
			});
		});
	}
}());
