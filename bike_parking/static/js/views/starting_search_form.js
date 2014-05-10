define([
    'backbone',
], function(Backbone) {
    var StartingSearchForm = Backbone.View.extend({
        events: {
            'submit': 'handleSubmit'
        },

        initialize: function() {
            this.searchBox = new google.maps.places.SearchBox($("#starting-address", this.el)[0]);
            this.on('places_changed', this.updateStartPoint);
            this.listenTo(BikeParking.mapVent, 'map:bounds_changed', this.updateSearchBounds);
        },

        updateSearchBounds: _.throttle(function() {
            console.log('changing bounds');
            this.searchBox.setBounds(BikeParking.map.getBounds());
        }, 500),

        handleSubmit: function(event) {
            event.preventDefault();
            this.updateStartPoint();
        },

        updateStartPoint: function() {
            if (!this.searchBox.getPlaces()) {
                return false;
            }
            var searchResult = this.searchBox.getPlaces()[0],
                startingPoint = {
                    lat: undefined,
                    lng: undefined
                };
            var center = BikeParking.map.getCenter();
            startingPoint.lat = center.lat();
            startingPoint.lng = center.lng();
            console.log(startingPoint.lat + " " + startingPoint.lng);
        }

    });

    return StartingSearchForm;
});
