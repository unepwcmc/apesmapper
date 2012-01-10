

App.modules.Data = function(app) {


    // Set of filters and stat responses
    var Report = Backbone.Model.extend({

        defaults: function() {
            return {
                "polygons": new Array(),
                "species": new Array(),
                "countries": new Array(),
                'stats': new Object()
            };
        },

        initialize: function() {
          _.bindAll(this, '_save');
          this.bind('change:polygons', this.fetch);
          this.save = _.debounce(this._save, 800);

        },

        _save: function() {
            return this.collection.save();
        },

        update_polygon: function(index, path) {
            this.get('polygons')[index] = path;
            this.trigger('change:polygons', this);
            this.trigger('change', this);
            this.save();
        },

        remove_polygon: function(index) {
            this.get('polygons').splice(index, 1);
            this.trigger('change:polygons', this);
            this.trigger('change', this);
            this.save();
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

        clear: function() {
            this.set({'polygons': [], 'stats': {}});
            this.trigger('change:polygons', this);
            this.trigger('change:stats', this);
            this.trigger('change', this);
            this.save();
        },

        fetch: function() {
            var self = this;
            // get data using polygons
            if(self.get('polygons').length === 0) {
                return;
            }
            app.WS.CartoDB.calculate_stats(this.get('polygons'), function(stats) {
              var new_stats = _.extend(self.get('stats'), stats);
              self.set({'stats': new_stats});
              //trigger manually
              self.trigger('change:stats', self);
              self.trigger('change', self);
              self.save();
              if(self.bus) {
                //self.bus.emit('loading_end');
              }
            });
        },

        toJSON: function() {
            //TODO: optimize this using a real shallow copy
            return JSON.parse(JSON.stringify(this.attributes));
        },

        is_total: function() {
          return this.get('total') !== undefined;
        }

    });

    // NOT A MODEL, collection of user reports
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
            if(app.config.LOCAL_STORAGE) {
                this.localStorage = new Store(this.work_id);
            }
        },

        url: function() {
            return this.API_URL + '/' + this.work_id;
        },

        create: function(success, fail) {
            var self = this;
            function _done(data) {
                // default data
                self.set_work_id(data.id);
                self.new_report({total: true});
                self.new_report();
                self.save({
                    success: function() {
                        success(data.id);
                    }
                });
            }
            if(!app.config.LOCAL_STORAGE) {
                $.ajax({
                    url: this.API_URL,
                    type: 'POST'})
                .done(_done)
                .fail(fail);
            } else {
                // simulte some lag
                setTimeout(function() {
                    _done({id: S4() + S4()});
                }, 500);
            }
        },

        // create empty report
        new_report: function(defaults, options) {
            var r = new Report();
            r.set(defaults);
            if(this.bus) {
                r.bus = this.bus;
            }
            this.add(r);
            return r.cid;
        },

        get_total_report: function() {
           for(var i = 0; i < this.models.length; ++i) {
              var r = this.models[i];
              if(r.get('total')) {
                return r;
              }
           }
        },

        get_reports: function() {
            return _.filter(this.models, function(r) {
                return r.get('total')=== undefined;
            });
        },

        on_add: function(r) {
            //Setup change binding and bus
            r.bind('change', this.on_report_change);
            if(this.bus) {
                r.bus = this.bus;
            }
        },

        on_add_all: function() {
            var self = this;
            this.each(function(r) { self.on_add(r); });
        },

        delete_report: function(rid) {
            var r = this.getByCid(rid);
            this.remove(r);
            r.unbind('change', this.on_report_change);
            //r.remove();
            this.save();
            this.aggregate_stats();
        },

        get_all_polygons: function() {
          // get all polygons in the same array
          var reports = _(this.get_reports()).filter(function(r) {
                return r.get('stats') !== undefined;
          });
          var polygons = [];
          _.each(reports, function(r) {
                _.each(r.get('polygons'), function(p) {
                    polygons.push(p);
                });
          });
          return polygons;
        },

        // agregate all the stats in the total report
        aggregate_stats: function() {
          var self = this;
          var reports = _(this.get_reports()).filter(function(r) {
                return r.get('stats') !== undefined;
          });
          var polygons = self.get_all_polygons();

          app.WS.CartoDB.aggregate_stats(reports, polygons, function(stats) {
            self.get_total_report().set({stats: stats});
          });
          /*this.filter(function(r) { return r.get('total') === undefined; }).each(function(r) {
          });*/
        },

        on_report_change: function(r) {
            if(!r.is_total()) {
              this.aggregate_stats();
            }
            this.trigger('report_change', r);
        },

        save: function(options) {
            Backbone.sync('update', this, options);
        },

        polygon_count: function() {
            return this.reduce(function(memo, r) {
                return memo + r.get('polygons').length;
            }, 0);
        }

    });

    app.Work = Class.extend({

        init: function(bus) {
            var self = this;
            _.bindAll(this, 'on_polygon', 'on_work', 'on_new_report','add_report', 'on_create_work', 'active_report', 'on_remove_polygon', 'on_update_polygon', 'on_clear', 'on_delete_report');
            this.bus = bus;
            this.work = new WorkModel();
            this.work.bus = bus;
            this.active_report_id = -1;
            this.bus.link(this, {
                'polygon': 'on_polygon',
                'work': 'on_work',
                'model:add_report': 'add_report',
                'model:create_work': 'on_create_work',
                'model:active_report': 'active_report',
                'model:remove_polygon': 'on_remove_polygon',
                'model:update_polygon': 'on_update_polygon',
                'model:clear': 'on_clear',
                'model:delete_report': 'on_delete_report'
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

        on_remove_polygon: function(rid, index) {
            var r = this.work.getByCid(rid);
            if(r) {
                r.remove_polygon(index);
            } else {
                app.Log.error("can't get report: ", rid);
            }
        },

        on_update_polygon: function(rid, index, new_path) {
            var r = this.work.getByCid(rid);
            if(r) {
                r.update_polygon(index, new_path);
            } else {
                app.Log.error("can't get report: ", rid);
            }
        },

        on_delete_report: function(rid) {
            var self = this;
            // if we only have the total and another report
            // dont remove, only clear polygons
            if(this.work.models.length == 2) {
                this.on_clear();
            } else {
                this.work.delete_report(rid);
                this.bus.emit('view:remove_all');
                this.work.each(function(r) {
                    self.on_new_report(r);
                });
            }
        },

        on_polygon: function(polygon) {
            // append polygon to current report
            var r = this.work.getByCid(this.active_report_id);
            var path = _.map(polygon.paths[0], function(p) {
              return new google.maps.LatLng(p[0], p[1]);
            });
            var area = google.maps.geometry.spherical.computeArea(path);
            if(area > app.config.MAX_POLYGON_AREA) {
              this.bus.emit("view:show_error", "We are sorry, but the polygon you are trying to analyze is too big.");
            } else {
              r.add_polygon(polygon.paths[0]);
            }
            app.Log.log("area: ", area);
        },

        on_clear: function() {
            var r = this.work.getByCid(this.active_report_id);
            r.clear();
        },

        on_work: function(work_id) {
            var self = this;
            app.Log.log("on work: ", work_id);
            this.work.set_work_id(work_id);
            this.work.fetch({
                success: function() {
                    self.bus.emit("app:work_loaded");
                }
            });
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
            this.work.save();
        },

        update_report: function() {
        },

        active_report: function(rid) {
            this.active_report_id = rid;
            var r = this.work.getByCid(rid);
            if(r) {
              this.bus.emit('view:show_report', rid, r.toJSON());
            }
        },

        select_report: function() {
        }

    });
};
