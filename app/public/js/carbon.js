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
    app.Map = Class.extend({
        init: function(bus) {
            _.bindAll(this, 'show_report');
            this.map = new MapView({el: $('.map_container')});
            this.polygon_edit = new PolygonDrawEditTool({mapview: this.map});
            this.polygon_edit.editing_state(true);
            this.polygons = [];

            bus.link(this, {
                'view:show_report': 'show_report',
                'view:update_report': 'show_report'
            });

            //bindings
            bus.attach(this.polygon_edit, 'polygon');

        },

        // render polygons
        show_report: function(rid, data) {
            var self = this;
            // clean
            _(self.polygons).each(function(p) {
                p.remove();
            });

            // recreate
            _(data.polygons).each(function(paths) {
                var p = new PolygonView({
                    mapview: self.map,
                    paths: paths
                });
                p.bind('click', function(p) {
                    self.polygon_edit.editing_state(false);
                    self.polygon_edit.edit_polygon([p.paths]);
                });
                self.polygons.push(p.render());
            });
        }
    });
};
