define([
    'backbone',
    'text!templates/main_map.html'
], function(Backbone, template) {
    var MainMapView = Backbone.View.extend({
        template: _.template(template),

        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });

    return MainMapView;
});
