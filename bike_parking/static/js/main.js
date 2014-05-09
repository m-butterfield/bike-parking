require.config({
    baseUrl: '/static/js',
    paths: {
        "async": '../vendor/async',
        "backbone": '../vendor/backbone',
        "bootstrap": '../vendor/bootstrap',
        "domReady": '../vendor/domReady',
        "jquery": '../vendor/jquery',
        "text": '../vendor/text',
        "underscore": '../vendor/underscore'
    },
    "shim": {
        "bootstrap": ["jquery"]
    },
    urlArgs: "bust=" + Math.floor(Math.random() * 1000000000)
});

require([
    'backbone',
    'domReady',
    'jquery',
    'underscore',
    'bootstrap',
    'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyAHu3tscS1tG243nstn6jiAS9L2kD1OwtQ&libraries=places&sensor=false'
], function(Backbone, domReady, $, _) {
    domReady(function() {
        require(['app']);
    });
});
