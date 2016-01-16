(function ($) {
  'use strict';

  var url = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places&callback=initialize';
  var markers = [];
  var map = {};
  var queryInput = {};
  var markerInfo = {};
  var autocomplete = {};

  window.initialize = function () {
    var zoom = 7;
    var center = new google.maps.LatLng(46.0139738, 25.0076595);
    var mapOptions = {
      zoom: zoom,
      center: center,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(queryInput);

    queryInput = document.getElementById('query');
    autocomplete = new google.maps.places.Autocomplete(queryInput);
    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', onSearchDestination);

    markerInfo = new google.maps.InfoWindow();
    map.addListener('click', onMarkerAdded);
  };

  $.getScript(url);

  $('[data-toggle="tooltip"]').tooltip();

  $('[data-trigger="tab"]').click(function (event) {
    event.preventDefault();

    var target = $(this).attr('href');

    $('a[href="' + target + '"]').tab('show');
  });

  var onMarkerAdded = function (eventData) {
    var latitude = eventData.latLng.lat();
    var longitude = eventData.latLng.lng();
    $.getJSON('http://localhost:1337/api/weather/dailyForecast?lat=' + latitude + '&lon=' + longitude, function (data) {

      var cityName = data.city.name;
      deleteMarkers();
      placeNewMarker(map, eventData.latLng, cityName);

      var html = getWeatherView(data);
      $('#forecast').html(html);
    });

    $('a[href="#weather"]').tab('show');
  };

  var onSearchDestination = function () {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert('Autocomplete\'s returned place contains no geometry');
      return;
    }

    deleteMarkers();
    placeNewMarker(map, place.geometry.location, place.name);

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }

    var latitude = place.geometry.location.lat();
    var longitude = place.geometry.location.lng();
    $.getJSON('http://localhost:1337/api/weather/dailyForecast?lat=' + latitude + '&lon=' + longitude, function (data) {
      var html = getWeatherView(data);
      $('#forecast').html(html);
    });

    $('a[href="#weather"]').tab('show');
  };

  var placeNewMarker = function (map, latLng, markerTitle) {
    markerInfo.close();
    var marker = new google.maps.Marker({
      position: latLng,
      draggable: true,
      map: map
    });

    markerInfo.setContent('<div><strong>' + markerTitle + '</strong></div>');
    markerInfo.open(map, marker);

    google.maps.event.addListener(marker, 'dragend', onMarkerAdded);
    markers.push(marker);
  };

  var setMapOnAllMarkers = function (map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  };

  var deleteMarkers = function () {
    setMapOnAllMarkers(null);
    markers = [];
  };

  var getWeatherView = function (weatherData) {
    var html = '<table class="table table-hover">';
    html += '<thead><tr><th>Day</th><th>Night</th><th></th><th></th></tr></thead><tbody>';

    $.each(weatherData.list, function (key, val) {
      html += '<tr>';
      html += '<td>' + val.temp.day + '&#8451;</td>';
      html += '<td><span class="text-muted">' + val.temp.night + '&#8451;</span></td>';
      html += '<td>' + val.weather[0].main + '<br>(' + val.weather[0].description + ')</td>';
      html += '<td><img src="' + val.weather[0].iconUrl + '"></td>';
      html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
  };

})(jQuery);
