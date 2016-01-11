(function ($) {
  'use strict';

  var url = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=initialize';

  window.initialize = function () {
    var zoom = 7;
    var center = new google.maps.LatLng(46.0139738, 25.0076595);
    var mapOptions = {
      zoom: zoom,
      center: center,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    google.maps.event.addListener(map, 'click', function () {
      $.getJSON('http://localhost:1337/api/weather/dailyForecast?q=Bucharest,ro', function (data) {
        var html = '<table class="table table-hover">';

        html += '<thead><tr><th>Day</th><th>Night</th><th></th><th></th></tr></thead><tbody>';

        $.each(data.list, function (key, val) {
          html += '<tr>';
          html += '<td>' + val.temp.day + '</td>';
          html += '<td><span class="text-muted">' + val.temp.night + '</span></td>';
          html += '<td>' + val.weather[0].main + '<br>(' + val.weather[0].description + ')</td>';
          html += '<td><img src="' + val.weather[0].iconUrl + '"></td>';
          html += '</tr>';
        });

        html += '</tbody></table>';

        $('#forecast').html(html);
      });

      $('a[href="#weather"]').tab('show');
    });
  };

  $.getScript(url);

  $('[data-toggle="tooltip"]').tooltip();

  $('[data-trigger="tab"]').click(function (event) {
    event.preventDefault();

    var target = $(this).attr('href');

    $('a[href="' + target + '"]').tab('show');
  });
})(jQuery);
