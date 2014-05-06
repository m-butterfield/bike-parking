define([
    'backbone',
    'views/main_map'
], function(Backbone, MainMapView) {
    var mainMapView = new MainMapView({
        el: $("#main-map")
    });
    mainMapView.render();
});
