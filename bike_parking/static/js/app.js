define([
    'backbone',
    'views/main_map',
    'views/starting_search_form'
], function(Backbone, MainMapView, StartingSearchForm) {

    var mainMapView = new MainMapView({
        el: $("#main-map")
    });

    var startingSearchForm = new StartingSearchForm({
        el: $("#starting-search-form")
    });
});
