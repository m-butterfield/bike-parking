define([
    'backbone',
    'views/main_map',
    'views/starting_search_form'
], function(Backbone, MainMapView, StartingSearchForm) {

    var Map = function(options) {
        this.getMap = function() {
            return options.map;
        };

        for (var prop in this.mapEvents) {
            var event = this.mapEvents[prop];
            this.addListener(event);
        }
    };

    _.extend(Map.prototype, Backbone.Events, {
        mapEvents: [
            "bounds_changed",
            "center_changed",
            "click",
            "dblclick",
            "drag",
            "dragend",
            "dragstart",
            "heading_changed",
            "idle",
            "maptypeid_changed",
            "mousemove",
            "mouseout",
            "mouseover",
            "projection_changed",
            "resize",
            "rightclick",
            "tilesloaded",
            "tilt_changed"
        ],

        addListener: function(event) {
            var mapObj = this;
            var referenceMap = this.getMap();
            google.maps.event.addListener(referenceMap, event, function(e) {
                var eventName = "map:" + event;
                mapObj.trigger(eventName, [e]);
            });
        },

        triggerEvent: function(event) {
            var reference_map = this.getMap();
            google.maps.event.trigger(reference_map, event);
        }
    });

    Backbone.Map = Map;

    var mainMapView = new MainMapView({
        el: $("#main-map")
    });
    var startingSearchForm = new StartingSearchForm({
        el: $("#starting-search-form")
    });
});
