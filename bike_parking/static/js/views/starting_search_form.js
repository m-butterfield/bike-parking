define([
    'backbone'
], function(Backbone) {

    var ParkingResult = Backbone.Model.extend({
        initialize: function(options) {
            this.latitude = options.latitude;
            this.longitude = options.longitude;
            this.location = options.location;
            this.name = options.name;
            this.marker = options.marker;
        }
    });

    var ParkingResults = Backbone.Collection.extend({
        model: ParkingResult
    });

    var StartingSearchForm = Backbone.View.extend({
        events: {
            'submit': 'handleSubmit'
        },

        initialize: function() {
            this.listenTo(BikeParking.boxVent, 'box:places_changed', this.updateStartPoint);
            this.listenTo(BikeParking.mapVent, 'map:bounds_changed', this.updateSearchBounds);
            this.listenTo(BikeParking.mapVent, 'map:idle', this.fetchParkingResults);
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
            this.parkingResults = BikeParking.results = new ParkingResults();
        },

        updateSearchBounds: function() {
            BikeParking.searchBox.setBounds(BikeParking.map.getBounds());
        },

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
        },

        fetchParkingResults: function() {
            var bounds = BikeParking.map.getBounds();
            var query = "?$limit=1000&$where=within_box(coordinates, " +
                bounds.getNorthEast().lat() + "," +
                bounds.getSouthWest().lng() + "," +
                bounds.getSouthWest().lat() + "," +
                bounds.getNorthEast().lng() + ")" +
                "AND status='COMPLETE' AND status_detail='INSTALLED'";
            var that = this;
            $.ajax({
                url: BikeParking.API_ENDPOINT + query
            }).done(function(results) {
                // if none were found, remove all from the map and collection
                if (!results.length) {
                    that.parkingResults.each(function(parkingResult) {
                        parkingResult.marker.setMap(null);
                    });
                    that.parkingResults.reset();
                    return;
                }
                // otherwise, just remove any markers not on the map anymore
                var parkingResultsModels = that.parkingResults.models.slice();
                parkingResultsModels.forEach(function(parkingResult) {
                    var exists = false;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].coordinates.latitude === parkingResult.latitude &&
                            results[i].coordinates.longitude === parkingResult.longitude) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        parkingResult.marker.setMap(null);
                        that.parkingResults.remove(parkingResult);
                    }
                });
                // make a new marker and add it to the map if it isn't there already
                for (var i = 0; i < results.length; i++) {
                    var exists = false;
                    for (var j = 0; j < that.parkingResults.models.length; j++) {
                        if (results[i].coordinates.latitude === that.parkingResults.models[j].latitude &&
                            results[i].coordinates.longitude === that.parkingResults.models[j].longitude) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        var location = new google.maps.LatLng(results[i].coordinates.latitude,
                            results[i].coordinates.longitude);
                        var marker = new google.maps.Marker({
                            map: BikeParking.map,
                            icon: that.parkingIcon,
                            title: results[i].location_name,
                            position: location
                        });
                        var parkingResult = new ParkingResult({
                            latitude: results[i].coordinates.latitude,
                            longitude: results[i].coordinates.longitude,
                            location: location,
                            name: results[i].location_name,
                            marker: marker
                        });
                        that.parkingResults.add(parkingResult);
                    }
                }
            });
        }

    });

    return StartingSearchForm;
});
