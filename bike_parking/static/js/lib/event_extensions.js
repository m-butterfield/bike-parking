define([
], function() {
    /*
    We need to extend the Backbone.Events object so that our views can listen to google maps events properly
     */

    // Map
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


    // SearchBox
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
})