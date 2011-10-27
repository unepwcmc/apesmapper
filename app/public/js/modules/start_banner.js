

App.modules.Banner = function(app) {

    var StartBanner = Backbone.View.extend({

        el: $('#start_banner'),

        events: {
            'click #create_work': 'create_work'
        },

        initialize: function() {
            this.bus = this.options.bus;
        },

        create_work: function(e) {
            if(e) e.preventDefault();
            this.bus.emit('model:create_work');
        },

        show: function() {
            this.el.show();
        },

        hide: function() {
            this.el.hide();
        }


    });

    app.StartBanner = function(bus) {
        var s = new StartBanner({bus: bus});
        return s;
    }
}
