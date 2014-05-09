define([
    'backbone',
    'views/main_map',
    'views/search_form'
], function(Backbone, MainMapView, SearchForm) {
    var mainMapView = new MainMapView({
        el: $("#main-map")
    });
    var searchForm = new SearchForm({
        el: $("#search-form")
    });
});
