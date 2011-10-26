/*
 ===============================================
 information panel control
 ===============================================
*/


App.modules.Panel = function(app) {

    app.Panel = Class.extend({

        init: function(bus) {
            _.bindAll(this, 'on_new_report', 'on_remove_all', 'on_update_report');

            this.bus = bus;
            this.panel = new Panel();
            this.panel.bind('add_report', function() {
                bus.emit('model:add_report');
            });
            this.bus.link(this, {
                'view:new_report': 'on_new_report',
                'view:remove_all': 'on_remove_all',
                'view:update_report': 'on_update_report'
            });
        },

        on_new_report: function(cid, data) {
            this.panel.add_report(cid, data);
        },

        on_remove_all: function() {
            this.panel.remove_all();
        },

        on_update_report: function(cid, r) {
            this.panel.update_report(cid, r);
        }

    });

}
