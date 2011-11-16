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
            jQuery.ajaxSetup({
                cache: false
            });
            $('html,body').css({overflow: 'hidden'});
        },

        run: function() {
            _.bindAll(this, 'on_route_to');
            var self = this;
            this.bus = new app.Bus();
            // set a global bus
            app.bus = this.bus;
            this.map = new app.Map(this.bus);
            this.work = new app.Work(this.bus);
            this.panel = new app.Panel(this.bus);
            this.banner = new app.StartBanner(this.bus);
            this.header = new app.Header();

            this.panel.hide();

            // init routing
            this.router = new Router();
            this.router.bind('route:work', this.on_route);

            this.bus.on('app:route_to', this.on_route_to);
            this.bus.on('app:work_loaded', function() {
                if(self.work.work.polygon_count() === 0) {
                    self.map.editing(true);
                } else {
                    var polys = self.work.work.get_all_polygons();
                    // I <3 my code
                    var b = new google.maps.LatLngBounds();
                    _.each(polys, function(p) {
                        _.each(p, function(point) {
                            var pos = new google.maps.LatLng(point[0], point[1]);
                            b.extend(pos);
                        });
                    });
                    self.map.map.map.fitBounds(b);
                }
            });
            this.bus.on('view:show_report', function(id, r) {
                self.map.editing(r.polygons.length === 0);
            });

            if(location.hash === '') {
                this.banner.show();
                if(jQuery.browser.msie === undefined) {
                    this.banner_animation();
                }
            }
            // ready, luanch
            Backbone.history.start();
            //this.router.navigate('w/work_test');
        },

        banner_animation: function() {
            var self = this;
            var update_vel = 0.01;
            this.bus.on('model:create_work', function() {
              update_vel = 0.2;
            });
            this.animation = setInterval(function() {
                var m = self.map.map;
                var c = m.get_center();
                m.set_center(new google.maps.LatLng(c.lat(), c.lng() + update_vel));
            }, 20);
        },

        on_route: function(work_id) {
            this.banner.hide();
            if(jQuery.browser.msie === undefined) {
                clearInterval(this.animation);
            }
            // show the panel and set mode to adding polys
            this.panel.show();
            this.map.show_controls(true);

            app.Log.debug("route: work => ", work_id);
            this.bus.emit('work', work_id);
        },

        on_route_to: function(route) {
            app.Log.debug("route => ", route);
            this.router.navigate(route, true);
        }

    });
};


