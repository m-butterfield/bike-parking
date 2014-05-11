define([
    'backbone'
], function(Backbone) {

    var SearchBox = function(options) {
        this.getSearchBox = function() {
            return options.searchBox;
        };

        for (var prop in this.boxEvents) {
            var event = this.boxEvents[prop];
            this.addListener(event);
        }
    };

    _.extend(SearchBox.prototype, Backbone.Events, {
        boxEvents: [
            "places_changed"
        ],

        addListener: function(event) {
            var boxObj = this;
            var referenceBox = this.getSearchBox();
            google.maps.event.addListener(referenceBox, event, function(e) {
                var eventName = "box:" + event;
                boxObj.trigger(eventName, [e]);
            });
        },

        triggerEvent: function(event) {
            var referenceBox = this.getSearchBox();
            google.maps.event.trigger(referenceBox, event);
        }
    });

    Backbone.SearchBox = SearchBox;

    BikeParking.searchBox = new google.maps.places.SearchBox($("#starting-address")[0]);
    BikeParking.boxVent = new Backbone.SearchBox({searchBox: BikeParking.searchBox});

    var StartingSearchForm = Backbone.View.extend({
        events: {
            'submit': 'handleSubmit',
            'click #use-location-button': 'useLocation'
        },

        initialize: function(options) {
            this.startingLocation = options.startingLocation;
            this.listenTo(BikeParking.boxVent, 'box:places_changed', this.updateStartPoint);
            this.listenTo(BikeParking.mapVent, 'map:bounds_changed', this.updateSearchBounds);
            this.startIcon = {
                url: '/static/img/blue-bike.gif',
                size: new google.maps.Size(70, 70),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(35, 70),
                scaledSize: new google.maps.Size(40, 40)
            };
        },

        updateSearchBounds: function() {
            BikeParking.searchBox.setBounds(BikeParking.map.getBounds());
        },

        handleSubmit: function(event) {
            event.preventDefault();
        },

        useLocation: function(event) {
            event.preventDefault();
            var that = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    that.updateStartPoint(location);
                    }, function() {
                        alert("Geolocation is not enabled, turn it on or use the search box instead.");
                    }
                );
            } else {
                alert("Geolocation is not supported, use the search box instead.");
            }
        },

        updateStartPoint: function(location) {
            // use the results of the autocomplete dropdown if there are any, otherwise use the center of the map
            var startingPoint = undefined,
                searchResult = undefined;
            if (location instanceof google.maps.LatLng) {
                startingPoint = location;
            } else {
                searchResult = BikeParking.searchBox.getPlaces()[0];
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
            BikeParking.map.setZoom(18);
            this.startingLocation.set({
                searchResult: searchResult,
                startingPoint: startingPoint
            });
        }

    });

    return StartingSearchForm;
});
