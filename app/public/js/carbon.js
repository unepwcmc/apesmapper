/*
 ===============================================
 main enter point
 ===============================================
*/

App.modules.Carbon = function(app) {

   // app router
   var Router = Backbone.Router.extend({
      routes: {
        "w/:work":        "work",  // #work
        "w/:work/:state": "work"   // #work/state
      },

      work: function() {
        app.Log.log("route: work");
      }

    });

    // the app
    app.Carbon = Class.extend({

        init: function() {
            _.bindAll(this, 'on_route');
            // set a common syntax for templates
            _.templatesettings = {
                interpolate : /\{\{(.+?)\}\}/g
            };
        },

        run: function() {
            _.bindAll(this, 'on_route_to');
            this.bus = new app.Bus();
            this.map = new app.Map(this.bus);
            this.work = new app.Work(this.bus);
            this.panel = new app.Panel(this.bus);
            this.banner = new app.StartBanner(this.bus);

            // init routing
            this.router = new Router();
            this.router.bind('route:work', this.on_route);

            this.bus.on('app:route_to', this.on_route_to);

            if(location.hash === '') {
                this.banner.show();
            }
            // ready, luanch
            Backbone.history.start();
            //this.router.navigate('w/work_test');
        },

        on_route: function(work_id) {
            this.banner.hide();
            app.Log.debug("route: work => ", work_id);
            this.bus.emit('work', work_id);
        },

        on_route_to: function(route) {
            app.Log.debug("route => ", route);
            this.router.navigate(route, true);
        }

    });
};


/*
 ===============================================
 control map related things
 ===============================================
*/
App.modules.Map = function(app) {

    // edit, delete popup shown when user is editing a poly
    var Popup = Backbone.View.extend({
        el: $('#polygon_popup'),

        events: {
            'click #delete': 'remove',
            'click #done': 'edit'
        },

        initialize: function() {
            _.bindAll(this, 'show', 'hide', 'remove', 'edit');
            this.map = this.options.mapview;
            this.smooth = this.options.smooth || true;
            this.smooth_k = 0.08;
            this.target_pos = null;
            this.current_pos = null;
        },

        remove: function(e) {
            e.preventDefault();
            this.trigger('remove');
        },

        edit: function(e) {
            e.preventDefault();
            this.trigger('edit');
        },

        show: function(at) {
            var self = this;
            var px = this.map.projector.transformCoordinates(at);
            if(!this.timer) {
                this.timer = setInterval(function() {
                    self.current_pos.x += (self.target_pos.x - self.current_pos.x)*self.smooth_k;
                    self.current_pos.y += (self.target_pos.y - self.current_pos.y)*self.smooth_k;
                    self.set_pos(self.current_pos);
                }, 20);
                this.current_pos = px;
            }
            this.target_pos = px;

            if(!this.smooth) {
                set_pos(px);
            }
        },

        set_pos: function(p) {
            this.el.css({
                top: this.current_pos.y - 20 - 50,
                left: this.current_pos.x
            });
            this.el.show();
        },

        hide: function() {
            this.el.hide();
            if(this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }
    });

    app.Map = Class.extend({
        init: function(bus) {
            _.bindAll(this, 'show_report', 'start_edit_polygon', 'end_edit_polygon', 'remove_polygon');
            this.map = new MapView({el: $('.map_container')});
            this.popup = new Popup({mapview: this.map});
            this.polygon_edit = new PolygonDrawTool({mapview: this.map});
            this.polygon_edit.editing_state(true);
            this.polygons = [];
            this.bus = bus;

            this.movement_timeout = -1;

            bus.link(this, {
                'view:show_report': 'show_report',
                'view:update_report': 'show_report'
            });

            //bindings
            bus.attach(this.polygon_edit, 'polygon');
            this.popup.bind('edit', this.end_edit_polygon);
            this.popup.bind('remove', this.remove_polygon);

        },

        // render polygons
        show_report: function(rid, data) {
            var self = this;
            // clean
            _(self.polygons).each(function(p) {
                p.remove();
            });

            // recreate
            _(data.polygons).each(function(paths, i) {
                var p = new PolygonView({
                    mapview: self.map,
                    paths: paths
                });
                p.report = rid;
                p.polygon_id = i;
                p.bind('click', self.start_edit_polygon);
                self.polygons.push(p.render());
            });
        },

        start_edit_polygon: function(p) {
            var self = this;
            this.finish_editing();
            this.editing_poly = p;
            this.paths = [p.paths];
            this.polygon_edit.editing_state(false);
            this.polygon_edit.edit_polygon(this.paths);
            this.polygon_edit.bind('mousemove', function(p, e) {
                self.popup.show(e.latLng);
            });
        },

        finish_editing: function() {
            this.polygon_edit.unbind('mousemove', null);
            this.polygon_edit.reset();
            this.popup.hide();
            this.polygon_edit.editing_state(true);
        },

        end_edit_polygon: function(p) {
            this.finish_editing();
            var p = this.editing_poly;
            app.Log.debug("changing polygon", p.report, p.polygon_id);
            this.bus.emit('model:update_polygon', p.report, p.polygon_id, this.paths[0]);
        },

        remove_polygon: function() {
            this.finish_editing();
            var p = this.editing_poly;
            this.bus.emit('model:remove_polygon', p.report, p.polygon_id);
        }
    });
};
