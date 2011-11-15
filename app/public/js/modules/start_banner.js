

App.modules.Banner = function(app) {

    var StartBanner = Backbone.View.extend({

        el: $('#start_banner'),

        events: {
            'click #create_work': 'create_work'
        },

        initialize: function() {
            this.bus = this.options.bus;
            this.creating = false;
        },

        create_work: function(e) {
            var self = this;
            if(e) e.preventDefault();
            if(!this.creating) {
              self.bus.emit('model:create_work');
              this.$('.button_info').html("creating...");
            }
            this.creating = true;
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
