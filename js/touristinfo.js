(function () {
  'use strict';

  if (typeof window.touristinfo === 'undefined') {
    window.touristinfo = {};
  }

  touristinfo.map = {
    center: {
      lat: 46.0139738,
      lng: 25.0076595
    },
    instance: {},
    markers: [],
    mode: 'view',
    zoom: 7
  };
})();
