(function ($) {
  'use strict';

  var url = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places&callback=touristinfo.map.init';
  var map = touristinfo.map.instance;
  var autocomplete = touristinfo.map.autocomplete;

  function addMarker(place) {
    var marker = new google.maps.Marker({
      id: place.id,
      map: map,
      position: {
        lat: place.latitude,
        lng: place.longitude
      },
      title: place.name
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
  }

  touristinfo.map.init = function () {
    var mapOptions = {
      center: touristinfo.map.center,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: touristinfo.map.zoom
    };

    map = new google.maps.Map($('#map')[0], mapOptions);

    $.getJSON('/ajax/places', function (places) {
      for (var i = places.length - 1; i >= 0; i--) {
        addMarker(places[i]);
      }
    });

    autocomplete = new google.maps.places.Autocomplete($('#query')[0]);

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

  $('#view').tooltip({
    container: 'body',
    html: true,
    placement: 'right',
    selector: '[data-toggle="tooltip"]'
  });

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

  $('#filter-places').submit(function (event) {
    event.preventDefault();

    var place = autocomplete.getPlace();

    if (!place.geometry) {
      window.alert('Autocomplete\'s returned place contains no geometry.');

      return;
    }

    var data = {
      distance: $('#distance').val(),
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      radius: $('#radius').val()
    };

    $.post('/ajax/places/filter', data, function (places) {
      for (var i = touristinfo.map.markers.length - 1; i >= 0; i--) {
        touristinfo.map.markers[i].setMap(null);
      }

      touristinfo.map.markers = [];

      for (i = places.length - 1; i >= 0; i--) {
        addMarker(places[i]);
      }
    });
  });

  $('#filter-places').on('reset', function () {
    $.getJSON('/ajax/places', function (places) {
      for (var i = touristinfo.map.markers.length - 1; i >= 0; i--) {
        touristinfo.map.markers[i].setMap(null);
      }

      touristinfo.map.markers = [];

      for (i = places.length - 1; i >= 0; i--) {
        addMarker(places[i]);
      }
    });
  });

  $('#add-place').submit(function (event) {
    event.preventDefault();

    $.post('/ajax/places/add', $('#add-place').serialize(), function (id) {
      var n = touristinfo.map.markers.length - 1;
      var marker = touristinfo.map.markers[n];

      marker.id = id;

      marker.setDraggable(false);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      marker.setTitle($('#name').val());

      touristinfo.map.activeMarker = marker;

      $('#add-place').trigger('reset');
      $('#place').load('/ajax/places/' + marker.id);
      $('a[href="#view"]').tab('show');
    });
  });

  $('#discard-place').click(function () {
    var marker = touristinfo.map.markers.pop();

    marker.setMap(null);
  });

  $('#query').keydown(function (event) {
    if (event.which == 13 && $('.pac-container:visible').length) {
      return false;
    }
  });
})(jQuery);
