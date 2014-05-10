define([
    'backbone'
], function(Backbone) {
    var MainMapView = Backbone.View.extend({
        initialize: function() {
            google.maps.visualRefresh = true;
            // San Francisco Coordinates :)
            var initialLocation = new google.maps.LatLng(37.7758356916692, -122.4182527108874);

            // Try W3C Geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    BikeParking.map.setCenter(initialLocation);
                    }, function() {
                        BikeParking.map.setCenter(initialLocation);
                    }
                );
             } else {
                console.log("Geolocation service failed.");
                BikeParking.map.setCenter(initialLocation);
            }
            var bikeLayer = new google.maps.BicyclingLayer();
            bikeLayer.setMap(BikeParking.map);

        }

    });

    return MainMapView;
});
