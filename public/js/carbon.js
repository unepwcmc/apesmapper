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
        "w/:work/*state": "work"   // #work/state
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
            _.bindAll(this, 'on_route_to', '_state_url');
            var self = this;
            this.bus = new app.Bus();
            // set a global bus
            app.bus = this.bus;
            this.map = new app.Map(this.bus);
            this.work = new app.Work(this.bus);
            this.apes = new app.Apes();
            this.panel = new app.Panel(this.bus);
            this.banner = new app.StartBanner(this.bus);
            this.header = new app.Header();

            this.panel.hide();

            // init routing
            this.router = new Router();
            this.router.bind('route:work', this.on_route);

            this.bus.on('app:route_to', this.on_route_to);
            this.bus.on('app:work_loaded', function() {
                /*
 *        var default_pos = new google.maps.LatLng(28.488005204159457, 7.403798828124986);
                self.map.map.set_center(default_pos);
                self.map.map.set_zoom(2);

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
                */
            });
            this.bus.on('view:show_report', function(id, r) {
                self.map.editing(r.polygons.length === 0);
            });

            this.bus.on('view:show_error', function(error) {
              app.Error.show(error);
            });

            this.state_url = _.debounce(this._state_url, 200);
            this.map.map.bind('center_changed', this.state_url);
            this.map.map.bind('zoom_changed', this.state_url);
            this.bus.on('map:reorder_layers', this.state_url);

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

        _state_url: function() {
            var self = this;
            if(self.work_id === undefined) return;
            var center = self.map.map.get_center();
            var zoom = self.map.map.get_zoom();
            var data = [];
            data.push(zoom, center.lat(), center.lng());
            var map_pos = data.join(',');

            var layers = self.map.map.layers;
            var layer_data = [];
            var layer_indexes = _.pluck(app.config.MAP_LAYERS,'name');
            _(self.map.map.layers_order).each(function(name) {
                var layer = layers[name];
                var idx = _.indexOf(layer_indexes, name);
                layer_data.push(idx);
                layer_data.push(layer.enabled?1:0);
            });

            self.router.navigate('w/' + self.work_id + '/' + map_pos + '|' + layer_data.join(','));
        },

        set_state: function(st) {
          var self = this;
          self.map.map.set_center(new google.maps.LatLng(st.lat,st.lon));
          self.map.map.set_zoom(st.zoom);
          _.each(st.layers, function(layer) {
            self.map.enable_layer(layer.name, layer.enabled);
          });
          self.map.layer_editor.sort_by(st.layers.reverse());
          self.bus.emit('map:reorder_layers', _.pluck(st.layers, 'name'));
       },

       decode_state: function(state) {
          var states = state.split('|');
          var maps = states[0];
          var tk = maps.split(',');

          // layers
          var layers = states[1].split(',');
          var layers_state = [];
          var layer_indexes = _.pluck(app.config.MAP_LAYERS,'name');
          for(var i = 0; i < layers.length/2; ++i) {
            var idx = layers[i*2];
            var enabled = layers[i*2 + 1];
            layers_state.push({
              name: layer_indexes[parseInt(idx, 10)], 
              enabled: parseInt(enabled, 10) !== 0 ? true: false
            });
          }
          return {
            zoom : parseInt(tk[0], 10),
            lat: parseFloat(tk[1]),
            lon: parseFloat(tk[2]),
            layers: layers_state
          };
       },

       on_route: function(work_id, state) {
            this.work_id = work_id;
            this.banner.hide();
            this.map.work_mode();
            if(jQuery.browser.msie === undefined) {
                clearInterval(this.animation);
            }
            // show the panel and set mode to adding polys
            this.panel.show();
            this.map.show_controls(true);

            app.Log.debug("route: work => ", work_id);
            this.bus.emit('work', work_id);
            if(state) {
              this.set_state(this.decode_state(state));
            }
        },

        on_route_to: function(route) {
            app.Log.debug("route => ", route);
            this.router.navigate(route, true);
        }

    });
};


