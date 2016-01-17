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
        (function () {
          var marker = new google.maps.Marker({
            id: data[i].id,
            map: map,
            position: {
              lat: data[i].latitude,
              lng: data[i].longitude
            },
            title: data[i].name
          });

          touristinfo.map.markers.push(marker);

          marker.addListener('click', function() {
            var mode = touristinfo.map.mode;

            if ((mode !== 'explore') && (mode !== 'view')) {
              return;
            }

            if (mode === 'view') {
              touristinfo.map.activeMarker.setAnimation(null);
            }

            marker.setAnimation(google.maps.Animation.BOUNCE);

            touristinfo.map.activeMarker = marker;

            $('#place').load('/ajax/places/' + marker.id);

            if (mode === 'explore') {
              $('a[href="#view"]').tab('show');
            }
          });
        })();
      }
    });

    var autocomplete = new google.maps.places.Autocomplete($('#query')[0]);

    autocomplete.bindTo('bounds', map);

    map.addListener('click', function (event) {
      if (touristinfo.map.mode === 'add') {
        var marker = new google.maps.Marker({
          map: map,
          position: event.latLng,
          draggable: true
        });

        touristinfo.map.markers.push(marker);

        touristinfo.map.mode = 'added';

        $('#latitude').val(event.latLng.lat);
        $('#longitude').val(event.latLng.lng);

        marker.addListener('dragend', function (event) {
          $('#latitude').val(event.latLng.lat);
          $('#longitude').val(event.latLng.lng);
        });
      }
    });
  };

  $.getScript(url);

  $('[data-toggle="tooltip"]').tooltip();

  $('[data-trigger="tab"]').click(function (event) {
    if ($(this).is('a')) {
      event.preventDefault();
    }

    var target = $(this).attr('href') || $(this).data('target');

    $('a[href="' + target + '"]').tab('show');
  });

  $('a[data-toggle="tab"]').on('show.bs.tab', function (event) {
    var target = $(event.target).attr('href');

    switch (target) {
      case '#search':
        touristinfo.map.mode = 'explore';

        break;

      case '#new':
        touristinfo.map.mode = 'add';

        for (var i = touristinfo.map.markers.length - 1; i >= 0; i--) {
          touristinfo.map.markers[i].setVisible(false);
        }

        break;

      case '#view':
        touristinfo.map.mode = 'view';

        break;
    }
  });

  $('a[data-toggle="tab"]').on('hide.bs.tab', function (event) {
    var target = $(event.target).attr('href');

    switch (target) {
      case '#new':
        touristinfo.map.mode = 'explore';

        for (var i = touristinfo.map.markers.length - 1; i >= 0; i--) {
          touristinfo.map.markers[i].setVisible(true);
        }

        break;

      case '#view':
        touristinfo.map.mode = 'explore';

        if (touristinfo.map.activeMarker !== null) {
          touristinfo.map.activeMarker.setAnimation(null);

          touristinfo.map.activeMarker = null;
        }

        break;
    }
  });

  $('#discard-place').click(function () {
    var marker = touristinfo.map.markers.pop();

    marker.setMap(null);
  });

  $('#add-place').click(function (event) {
    event.preventDefault();

    $.post('/ajax/places/add', $('#place-data').serialize(), function (data) {
      var n = touristinfo.map.markers.length - 1;
      var marker = touristinfo.map.markers[n];

      marker.id = data;

      marker.setDraggable(false);
      marker.setAnimation(google.maps.Animation.BOUNCE);

      touristinfo.map.activeMarker = marker;

      $('#place-data').trigger('reset');
      $('a[href="#view"]').tab('show');
    });
  });
})(jQuery);
