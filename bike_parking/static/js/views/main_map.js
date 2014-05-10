define([
    'backbone'
], function(Backbone) {
    var MainMapView = Backbone.View.extend({
        initialize: function() {
            google.maps.visualRefresh = true;
            // San Francisco Coordinates :)
            var initialLocation = new google.maps.LatLng(37.7758356916692, -122.4182527108874);

            var map = BikeParking.map = new google.maps.Map(this.el, {
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false
            });
            BikeParking.mapVent = new Backbone.Map({map: BikeParking.map});
            // Try W3C Geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    map.setCenter(initialLocation);
                    }, function() {
                        map.setCenter(initialLocation);
                    }
                );
             } else {
                console.log("Geolocation service failed.");
                map.setCenter(initialLocation);
            }
            var bikeLayer = new google.maps.BicyclingLayer();
            bikeLayer.setMap(map);

        },

        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });

    return MainMapView;
});
