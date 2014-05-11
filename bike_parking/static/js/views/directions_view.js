define([
    'backbone'
], function(Backbone) {

    var DirectionsView = Backbone.View.extend({

        initialize: function(options) {
            this.startingLocation = options.startingLocation;
            this.endingLocation = options.endingLocation;
            this.listenTo(this.startingLocation, "change", this.updateStartingLocation);
            this.listenTo(this.endingLocation, "change", this.updateEndingLocation);
            this.directionsService = new google.maps.DirectionsService();
            this.directionsDisplay = new google.maps.DirectionsRenderer({
                draggable: true,
                panel: $("#directions-panel")[0],
                map: BikeParking.map
            });
        },

        updateStartingLocation: function() {
            var startingPoint = this.startingLocation.get('startingPoint'),
                searchResult = this.startingLocation.get('searchResult');
            if (searchResult) {
                $("#starting-point", this.el).text("Starting Point: " +
                    searchResult.name + ", " + searchResult.formatted_address);
                if (this.endingLocation.get('location')) {
                    this.displayDirections();
                }
            } else {
                var geocoder = new google.maps.Geocoder();
                var that = this;
                geocoder.geocode({'latLng': startingPoint}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $("#starting-point").text("Starting Point: " +
                                results[1].formatted_address);
                            if (that.endingLocation.get('location')) {
                                that.displayDirections();
                            }
                        }
                    } else {
                        console.error("Geocoder failed due to: " + status);
                    }
                });
            }
        },

        updateEndingLocation: function() {
            var location = this.endingLocation.get('location');
            $("#ending-point", this.el).text("Ending Point: " + location.name);
            if (this.startingLocation.get('startingPoint')) {
                this.displayDirections();
            }
        },

        displayDirections: function() {
            var start = this.startingLocation.get('startingPoint'),
                end = this.endingLocation.get('location');
            if (!start || !end) {
                alert("You must choose a start and end point");
            }
            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.BICYCLING
            };
            var that = this;
            this.directionsService.route(request, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    that.directionsDisplay.setDirections(response);
                }
            });
        }

    });

    return DirectionsView;
});
