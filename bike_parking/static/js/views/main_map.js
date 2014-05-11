define([
    'backbone'
], function(Backbone) {

    var ParkingResult = Backbone.Model.extend();

    var ParkingResults = Backbone.Collection.extend({
        model: ParkingResult
    });

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
        initialize: function(options) {
            this.endingLocation = options.endingLocation;
            var map = BikeParking.map = new google.maps.Map(this.el, {
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false
            });
            BikeParking.mapVent = new Backbone.Map({map: map});
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

            this.parkingIcon = {
                url: '/static/img/green-bike.gif',
                size: new google.maps.Size(70, 70),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(35, 70),
                scaledSize: new google.maps.Size(40, 40)
            };

            this.parkingResults = BikeParking.results = new ParkingResults();
            this.listenTo(BikeParking.mapVent, 'map:idle', this.fetchParkingResults);
        },

        fetchParkingResults: function() {
            var bounds = BikeParking.map.getBounds();
            var data = {
                northeastLat: bounds.getNorthEast().lat(),
                northeastLng: bounds.getNorthEast().lng(),
                southwestLat: bounds.getSouthWest().lat(),
                southwestLng: bounds.getSouthWest().lng()
            }
            var that = this;
            $.ajax({
                url: '/nearby_parking',
                data: data
            }).done(function(results) {
                results = results.spots;
                // if none were found, remove all from the map and collection
                if (!results.length) {
                    that.parkingResults.each(function(parkingResult) {
                        parkingResult.get('marker').setMap(null);
                    });
                    that.parkingResults.reset();
                    return;
                }
                // otherwise, just remove any markers not on the map anymore
                var parkingResultsModels = that.parkingResults.models.slice();
                parkingResultsModels.forEach(function(parkingResult) {
                    var exists = false;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].lat === parkingResult.get('latitude') &&
                            results[i].lng === parkingResult.get('longitude')) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        parkingResult.get('marker').setMap(null);
                        that.parkingResults.remove(parkingResult);
                    }
                });
                // make a new marker and add it to the map if it isn't there already
                for (var i = 0; i < results.length; i++) {
                    var exists = false;
                    for (var j = 0; j < that.parkingResults.models.length; j++) {
                        if (results[i].lat === that.parkingResults.models[j].latitude &&
                            results[i].lng === that.parkingResults.models[j].longitude) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        var location = new google.maps.LatLng(results[i].lat, results[i].lng);
                        location.name = results[i].name;
                        var marker = new google.maps.Marker({
                            map: BikeParking.map,
                            icon: that.parkingIcon,
                            title: results[i].name,
                            position: location
                        });
                        google.maps.event.addListener(marker, 'click', function(marker) {
                            that.endingLocation.set({
                                'location': marker.latLng
                            });
                        });
                        var parkingResult = new ParkingResult({
                            latitude: results[i].lat,
                            longitude: results[i].lng,
                            location: location,
                            name: results[i].name,
                            marker: marker
                        });
                        that.parkingResults.add(parkingResult);
                    }
                }
            });
        }

    });

    return MainMapView;
});
