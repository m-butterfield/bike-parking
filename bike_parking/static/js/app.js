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

    var map = BikeParking.map = new google.maps.Map(mainMapView.el, {
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
            BikeParking.map.setCenter(initialLocation);
            }, function() {
                BikeParking.map.setCenter(initialLocation);
            }
        );
     } else {
        console.log("Geolocation service failed.");
        BikeParking.map.setCenter(initialLocation);
    }
    BikeParking.map.setZoom(17);
    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);
    BikeParking.mapVent = new Backbone.Map({map: BikeParking.map});

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

    BikeParking.searchBox = new google.maps.places.SearchBox($("#starting-address")[0]);
    BikeParking.boxVent = new Backbone.SearchBox({searchBox: BikeParking.searchBox});

    var startingSearchForm = new StartingSearchForm({
        el: $("#starting-search-form")
    });
});
