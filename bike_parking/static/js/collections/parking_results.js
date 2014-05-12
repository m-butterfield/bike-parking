define([
    'backbone',
    'models/parking_result'
], function(Backbone, ParkingResult) {

    var ParkingResults = Backbone.Collection.extend({
        model: ParkingResult
    });

    return ParkingResults;
});