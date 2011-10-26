

App.modules.Data = function(app) {


    var Report = Backbone.Model.extend({

        defaults: {
            "polygons": []
        },

        initialize: function() {
        },

        add_polygon: function(path) {
            this.get('polygons').push(path);
            // activate the signal machinery
            this.trigger('change:polygons', this);
            this.trigger('change', this);
            this.save();
        },

        fetch: function() {
            // get data using polygons
        }

    });

    var WorkModel = Backbone.Collection.extend({

        model: Report,

        initialize: function() {
            _.bindAll(this, 'on_report_change', 'on_add', 'on_add_all');
            this.bind('add', this.on_add);
            this.bind('reset', this.on_add_all);
        },

        set_work_id: function(id) {
            this.work_id = id;
            this.localStorage = new Store(this.work_id);
        },

        url: function() {
            return '/RAMBO/' + this.id;
        },

        // create empty report
        new_report: function() {
            var r = new Report();
            this.add(r);
            r.save();
            //this.save();
            return r.cid;
        },

        on_add: function(r) {
            r.bind('change', this.on_report_change);
        },

        on_add_all: function() {
            var self = this;
            this.each(function(r) { self.on_add(r); });
        },

        delete_report: function(rid) {
            var r = this.at(rid);
            this.remove(r);
            r.unbind('change', this.on_report_change);
            r.remove();
            //this.save();
        },

        on_report_change: function(r) {
            this.trigger('report_change', r);
        }

    });

    app.Work = Class.extend({

        init: function(bus) {
            var self = this;
            _.bindAll(this, 'on_polygon', 'on_work', 'on_new_report','add_report');
            this.bus = bus;
            this.work = new WorkModel();
            this.active_report_id = -1;
            this.bus.link(this, {
                'polygon': 'on_polygon',
                'work': 'on_work',
                'model:add_report': 'add_report'
            });

            this.work.bind('add', this.on_new_report);
            this.work.bind('reset', function() {
                app.Log.log("reset", this.models);
                self.bus.emit('view:remove_all');
                this.each(function(r) {
                    self.on_new_report(r);
                });
            });
            this.work.bind('report_change', function(r) {
                self.bus.emit('view:update_report', r.cid, r.toJSON());
            });
        },

        on_polygon: function(polygon) {
            // append polygon to current report
            var r = this.work.getByCid(this.active_report_id);
            r.add_polygon(polygon.path);
        },

        on_work: function(work_id) {
            app.Log.log("on work: ", work_id);
            this.work.set_work_id(work_id);
            this.work.fetch();
            //this.reset({ });
        },

        on_new_report: function(r) {
            this.bus.emit('view:new_report', r.cid, r.toJSON());
            this.active_report(r.cid);
        },

        add_report: function() {
            this.work.new_report();
        },

        update_report: function() {
        },

        active_report: function(rid) {
            this.active_report_id = rid;
            this.bus.emit('show_report', rid);
        },
 
        select_report: function() {
        }
    });
};
