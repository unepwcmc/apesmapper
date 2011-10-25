

App.modules.Data = function(app) {

    var WorkModel = Backbone.Model.extend({
        defaults: {
            "reports": []
        },

        initialize: function() {
        },

        new_report: function() {
            this.get('reports').append({
                polygons: []
            });
            return this.get('reports').length;
        }

    });

    app.Work = Class.extend({

        init: function(bus) {
            this.bus = bus;
            this.work = new WorkModel();
            this.bus.link(this, {
                'polygon': 'on_polygon',
                'work': 'on_work'
            });
        },

        on_polygon: function(polygon) {
            app.Log.log("new polygon: ", polygon.path);
        },

        on_work: function(work_id) {
            app.Log.log("on work: ", work_id);
            this.work.set({id: work_id});
            this.fetch();
        },

        new_report: function() {
        },

        select_report: function() {
        }
    });
};
