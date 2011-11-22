/*
 ===============================================
 information panel control
 ===============================================
*/


App.modules.Panel = function(app) {

    var Loader = Backbone.View.extend({
        
        initialize: function() {
            _.bindAll(this, 'show', 'hide');
            this.count = 0;
            this.interval = null;
        },

        show: function() {
            app.Log.log("loading");
            var el = $('.loader');
            el.show();
            this.count++;
            if(this.count === 1) {
                app.bus.emit("loading_started");
                /*this.interval = setInterval(function() {
                   var el = $('.loader');
                   el.show();
                }, 400);
                */
            }
        },

        hide: function() {
            if(this.count === 0) return;
            //var el = $('.loader');
            this.count--;
            if(this.count === 0) {
                app.bus.emit("loading_finished");
                //el.hide();
                //clearInterval(this.interval);
            }
        }
    });

    app.Panel = Class.extend({

        init: function(bus) {
            _.bindAll(this, 'on_new_report', 'on_remove_all', 'on_update_report', 'on_show_report');

            var self = this;
            this.bus = bus;
            this.loader = new Loader();
            this.panel = new Panel({bus: this.bus});
            this.panel.bind('add_report', function() {
                bus.emit('model:add_report');
            });
            this.panel.tabs.bind('enable', function(cid) {
                bus.emit('model:active_report', cid);
            });
            this.bus.link(this, {
                'view:new_report': 'on_new_report',
                'view:remove_all': 'on_remove_all',
                'view:update_report': 'on_update_report',
                'view:show_report': 'on_show_report'
            });
            this.bus.on('loading_start', function() {
                self.loader.show();
            });
            this.bus.on('loading_end', function() {
                self.loader.hide();
            });

            this.loader.hide();
        },

        on_new_report: function(cid, data) {
            this.panel.add_report(cid, data);
        },

        on_remove_all: function() {
            this.panel.remove_all();
        },

        on_update_report: function(cid, r) {
            this.panel.update_report(cid, r);
            if(r.polygons.length > 0) {
                this.show();
            }
        },

        on_show_report: function(cid) {
            this.panel.show_report(cid);
        },

        hide: function() {
            this.panel.hide();
        },

        show: function() {
            this.panel.show();
        }

    });

};
