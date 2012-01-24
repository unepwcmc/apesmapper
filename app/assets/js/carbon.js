/*
 ===============================================
 main enter point
 ===============================================
*/

App.modules.Carbon = function(app) {

   // app router
   var Router = Backbone.Router.extend({
      routes: {
        "":        "create_work",  // #work
        "w/:work":        "work",  // #work
        "w/:work/*state": "work"   // #work/state
      },

      create_work: function() {
        // This triggers the route:create_work event,
        // which actually does the scoped work in app.Carbon.create_work
        app.Log.log("route: landing");
      },

      work: function() {
        app.Log.log("route: work");
      }

    });

    // the app
    app.Carbon = Class.extend({

        init: function() {
            _.bindAll(this, 'create_work');
            _.bindAll(this, 'on_route');
            jQuery.ajaxSetup({
                cache: false
            });
        },

        run: function() {
            _.bindAll(this, 'on_route_to', '_state_url');
            var self = this;

            // init Models
            this.bus = new app.Bus();
            app.bus = this.bus; // set a global bus
            this.map = new app.Map(this.bus);
            this.work = new app.Work(this.bus);
            this.apes = new app.Apes();
            this.countries = new app.Countries();
            this.sites = new app.Sites();

            // init Views
            this.selectedFilterView = new App.views.SelectedApesCountries({bus:this.bus, apes: this.apes.allApes, countries: this.countries.allCountries});
            this.speciesFilterEdit = new App.views.SpeciesFilterEdit({bus:this.bus, apes: this.apes.allApes});
            this.countriesFilterEdit = new App.views.CountriesFilterEdit({bus:this.bus, countries: this.countries.allCountries});
            this.slideFilters = new App.views.SlideFilters({bus:this.bus, apes: this.apes.allApes, countries: this.countries.allCountries, sites: this.sites.allSites});
            this.graph = new App.views.Graph({sites: this.sites.allSites});
            this.header = new app.Header();

            // init routing and bind methods requiring this scope to routes
            this.router = new Router({bus: this.bus});
            this.router.bind('route:create_work', this.create_work);
            this.router.bind('route:work', this.on_route);

            this.bus.on('app:route_to', this.on_route_to);
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

            // ready, launch
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
            //this.banner.hide();
            this.map.work_mode();
            if(jQuery.browser.msie === undefined) {
                clearInterval(this.animation);
            }
            // show the panel and set mode to adding polys
            this.map.show_controls(true);

            app.Log.debug("route: work => ", work_id);
            this.bus.emit('work', work_id);
            if(state) {
              this.set_state(this.decode_state(state));
            }
        },

        create_work: function() {
            this.bus.emit('model:create_work');
        },

        on_route_to: function(route) {
            app.Log.debug("route => ", route);
            this.router.navigate(route, true);
        }

    });
};


