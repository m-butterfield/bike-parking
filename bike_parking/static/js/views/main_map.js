define([
    'backbone'
], function(Backbone) {

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

    var MainMapView = Backbone.View.extend({
        initialize: function() {
            var map = BikeParking.map = new google.maps.Map(this.el, {
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false
            });
            google.maps.visualRefresh = true;

            // San Francisco Coordinates :)
            var initialLocation = new google.maps.LatLng(37.7758356916692, -122.4182527108874);

            // Try W3C Geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    map.setCenter(initialLocation);
                    }, function() {
                        map.setCenter(initialLocation);
                    }
                );
             } else {
                console.log("Geolocation service failed.");
                map.setCenter(initialLocation);
            }

            map.setZoom(18);
            var bikeLayer = new google.maps.BicyclingLayer();
            bikeLayer.setMap(map);
            BikeParking.mapVent = new Backbone.Map({map: map});
        }

    });

    return MainMapView;
});
