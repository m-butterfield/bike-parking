define([
    'backbone'
], function(Backbone) {
    var StartingSearchForm = Backbone.View.extend({
        events: {
            'submit': 'handleSubmit'
        },

        initialize: function() {
            this.listenTo(BikeParking.boxVent, 'box:places_changed', this.updateStartPoint);
            this.listenTo(BikeParking.mapVent, 'map:bounds_changed', this.updateSearchBounds);
            //this.listenTo(BikeParking.mapVent, 'map:bounds_changed', this.fetchParkingResults);
            this.startIcon = {
                url: '/static/img/blue-bike.gif',
                size: new google.maps.Size(70, 70),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(35, 70),
                scaledSize: new google.maps.Size(70, 70)
            };
            this.parkingIcon = {
                url: '/static/img/green-bike.gif',
                size: new google.maps.Size(70, 70),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(35, 70),
                scaledSize: new google.maps.Size(70, 70)
            };
        },

        updateSearchBounds: _.throttle(function() {
            BikeParking.searchBox.setBounds(BikeParking.map.getBounds());
        }, 500),

        handleSubmit: function(event) {
            event.preventDefault();
            this.updateStartPoint();
        },

        updateStartPoint: function() {
            // use the results of the autocomplete dropdown if there are any, otherwise use the center of the map
            var startingPoint = undefined;
            if (!BikeParking.searchBox.getPlaces()) {
                var center = BikeParking.map.getCenter();
                startingPoint = new google.maps.LatLng(center.lat(), center.lng());
            } else {
                var searchResult = BikeParking.searchBox.getPlaces()[0];
                startingPoint = searchResult.geometry.location;
            }
            this.startMarker && this.startMarker.setMap(null);
            this.startMarker = new google.maps.Marker({
                map: BikeParking.map,
                icon: this.startIcon,
                title: "Start Point",
                position: startingPoint
            });

            var bounds = new google.maps.LatLngBounds();
            bounds.extend(startingPoint);
            BikeParking.map.fitBounds(bounds);
            BikeParking.map.setZoom(17);
            this.fetchParkingResults()
        },

        fetchParkingResults: _.throttle(function() {
            var bounds = BikeParking.map.getBounds();
            var query = "?$where=within_box(coordinates, " +
                bounds.getNorthEast().lat() + "," +
                bounds.getSouthWest().lng() + "," +
                bounds.getSouthWest().lat() + "," +
                bounds.getNorthEast().lng() + ")" +
                "AND status = 'COMPLETE' AND status_detail = 'INSTALLED'";
            $.ajax({
                url: BikeParking.API_ENDPOINT + query
            }).done(function(results) {
                debugger;
            });
        }, 1000)

    });

    return StartingSearchForm;
});
