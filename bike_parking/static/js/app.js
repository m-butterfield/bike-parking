define([
    'backbone',
    'views/main_map',
    'views/starting_search_form',
    'views/directions_view'
], function(Backbone, MainMapView, StartingSearchForm, DirectionsView) {

    var startingLocation = new Backbone.Model();
    var endingLocation = new Backbone.Model();

    var mainMapView = new MainMapView({
        el: $("#main-map"),
        endingLocation: endingLocation
    });

    var startingSearchForm = new StartingSearchForm({
        el: $("#starting-search-form"),
        startingLocation: startingLocation
    });

    var directionsView = new DirectionsView({
        el: $("#directions-view"),
        startingLocation: startingLocation,
        endingLocation: endingLocation
    });

});
