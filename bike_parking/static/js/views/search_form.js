define([
    'backbone',
], function(Backbone) {
    var SearchForm = Backbone.View.extend({
        events: {
            'submit': 'handleSubmit'
        },

        initialize: function() {
            this.searchBox = new google.maps.places.SearchBox($("#starting-address", this.el)[0]);
            google.maps.event.addListener(this.searchBox, 'places_changed', this.updateMap);
        },

        handleSubmit: function(event) {
            event.preventDefault();
            this.findDirections();
        },

        findDirections: function() {

        },

        updateMap: function() {
            console.log("Update the map!");
        }
    });

    return SearchForm;
});
