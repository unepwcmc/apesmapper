

App.modules.Bus = function(app) {

    app.Bus = Class.extend({

        init: function() {
            _.extend(this, Backbone.Events);
        },

        on: function(event_name, callback) {
            this.bind(event_name, callback);
        },

        emit: function() {
            this.trigger.apply(this, arguments);
        }

    });

};
