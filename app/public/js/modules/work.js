

App.modules.Data = function(app) {


    var Report = Backbone.Model.extend({

        defaults: function() {
            return {
                "polygons": new Array()
            };
        },

        initialize: function() {
        },

        add_polygon: function(path) {
            if(this.get('total')) {
                app.Log.error("can't add polygons to total");
                return;
            }
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

        API_URL: app.config.API_URL,
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
            return this.API_URL + '/' + this.id;
        },

        create: function(success, fail) {
            /*$.ajax({
                url: this.API_URL,
                type: 'POST'})
            .done(function(data) {
             })
            .fail(fail);*/
            // dummy
            success(S4() + S4());
            // default thing
            this.new_report();
            this.new_report({total: true});
        },

        // create empty report
        new_report: function(defaults) {
            var r = new Report();
            r.set(defaults);
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
            _.bindAll(this, 'on_polygon', 'on_work', 'on_new_report','add_report', 'on_create_work', 'active_report');
            this.bus = bus;
            this.work = new WorkModel();
            this.active_report_id = -1;
            this.bus.link(this, {
                'polygon': 'on_polygon',
                'work': 'on_work',
                'model:add_report': 'add_report',
                'model:create_work': 'on_create_work',
                'model:active_report': 'active_report'
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
            //TODO: does not exists
        },

        on_new_report: function(r) {
            this.bus.emit('view:new_report', r.cid, r.toJSON());
            this.active_report(r.cid);
        },

        on_create_work: function() {
            var self = this;
            this.work.create(function(id) {
                self.bus.emit("app:route_to", "w/" + id);
            }, function() {
                app.Log.error("failed creating work id");
            });

        },

        add_report: function() {
            this.work.new_report();
        },

        update_report: function() {
        },

        active_report: function(rid) {
            this.active_report_id = rid;
            var r = this.work.getByCid(rid);
            this.bus.emit('view:show_report', rid, r.toJSON());
        },

        select_report: function() {
        }
    });
};
