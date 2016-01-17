(function ($) {
  'use strict';

  var url = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places&callback=touristinfo.map.init';
  var map = touristinfo.map.instance;

  touristinfo.map.init = function () {
    var mapOptions = {
      center: touristinfo.map.center,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: touristinfo.map.zoom
    };

    map = new google.maps.Map($('#map')[0], mapOptions);

    $.getJSON('/ajax/places', function (data) {
      for (var i = data.length - 1; i >= 0; i--) {
        new google.maps.Marker({
          map: map,
          position: {
            lat: data[i].latitude,
            lng: data[i].longitude
          },
          title: data[i].name
        });
      }
    });

    var autocomplete = new google.maps.places.Autocomplete($('#query')[0]);

    autocomplete.bindTo('bounds', map);

    google.maps.event.addListener(map, 'click', function () {
      $('a[href="#view"]').tab('show');
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
