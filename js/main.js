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

    new google.maps.Map(document.getElementById('map'), mapOptions);
  };

  $.getScript(url);
})(jQuery);
