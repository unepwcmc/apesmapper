/*
 ===============================================
 main enter point
 ===============================================
*/

App.modules.Carbon = function(app) {

   // app router
   var Router = Backbone.Router.extend({
      routes: {
        "/*state": "work"   // #work/state
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
        },

        run: function() {
            _.bindAll(this, 'on_route_to', '_state_url', 'download', 'download_table', 'build_state', 'landingInput');
            var self = this;

            // init Models
            this.bus = new app.Bus();
            app.bus = this.bus; // set a global bus
            this.categories = new app.Categories();
            this.apes = new app.Apes();
            this.species = new app.Species();
            this.regions = new app.Regions();
            this.countries = new app.Countries();
            this.species_ials = new app.SpeciesIals();


            // init Views
            this.map = new app.Map({bus:this.bus, species_ials: this.species_ials.allSpeciesIals}); // This actually contains the map view...
            this.selectedFilterView = new App.views.SelectedSpeciesCountries({bus:this.bus, species: this.species.allSpecies, countries: this.countries.allCountries});

            this.categoriesFilterEdit = new App.views.CategoriesFilterEdit({bus:this.bus, categories: this.categories.allCategories, apes: this.apes.allApes, species: this.species.allSpecies});
            this.apesFilterEdit = new App.views.ApesFilterEdit({bus:this.bus, categories: this.categories.allCategories, apes: this.apes.allApes, species: this.species.allSpecies});
            this.speciesFilterEdit = new App.views.SpeciesFilterEdit({bus:this.bus, species: this.species.allSpecies, categories: this.categories.allCategories, apes: this.apes.allApes});

            this.regionsFilterEdit = new App.views.RegionsFilterEdit({bus:this.bus, regions: this.regions.allRegions});
            this.countriesFilterEdit = new App.views.CountriesFilterEdit({bus:this.bus, countries: this.countries.allCountries, regions: this.regions.allRegions});
            this.slideFilters = new App.views.SlideFilters({bus:this.bus, species: this.species.allSpecies, countries: this.countries.allCountries, species_ials: this.species_ials.allSpeciesIals, species_ials_min_max: this.species_ials.allSpeciesIalsMinMax});
            this.graph = new App.views.Graph({species_ials: this.species_ials.allSpeciesIals});
            this.resultTable = new App.views.ResultTable({species_ials: this.species_ials.allSpeciesIals});
            this.resultSummary = new App.views.ResultSummary({species_ials: this.species_ials.allSpeciesIals});

            // init routing and bind methods requiring this scope to routes
            this.router = new Router({bus: this.bus});
            this.router.bind('route:work', this.on_route);

            this.bus.on('app:route_to', this.on_route_to);

            this.bus.on('view:show_error', function(error) {
              app.Error.show(error);
            });

            //this.state_url = _.debounce(this._state_url, 200);
            //this.map.map.bind('center_changed', this.state_url);
            //this.map.map.bind('zoom_changed', this.state_url);
            //this.bus.on('map:reorder_layers', this.state_url);

            this.bus.on('species:change', this.species_ials.allSpeciesIals.selectSpecies);

            this.bus.on('countries:change', this.species_ials.allSpeciesIals.selectCountries);

            $("a#download_button").click(this.download);
            $("a#download_table_button").click(this.download_table);

            $("button.select_region").click(this.landingInput);

            // ready, launch
            Backbone.history.start();
            //this.router.navigate('w/work_test');
        },
        landingInput: function(event){
          var region_id = $(event.currentTarget).attr("id").replace("select_region_","");
          $("#landing").dialog("close");

          this.countries.allCountries.region_id = region_id;
          this.species.allSpecies.region_id = region_id;
          this.species_ials.allSpeciesIalsMinMax.region_id = region_id;
          this.apes.allApes.region_id = region_id;

          this.fetchEverything();
        },
        fetchEverything: function() {
          //Fetches all our collections
          this.species.allSpecies.fetch();
          this.countries.allCountries.fetch();

          this.species_ials.allSpeciesIals.fetch();
          this.species_ials.allSpeciesIalsMinMax.fetch({
          	success: function(collection, response){
              app.bus.emit('update_sliders_bounds');
            }
          });
          this.categories.allCategories.fetch();
          this.apes.allApes.fetch();
        },
        download: function() {
          this.formPost( "/csv", {
            q: this.species_ials.allSpeciesIals.url().split("?q=")[1],
            type: "sites"
          });
          return false;
        },
        download_table: function() {
          alert("This doesn't work yet, sorry!");
          window.location.href = "/csv?" + this.species_ials_table.allSpeciesIals.speciesOccurrenceQuery() + "&type=species_occurrences";
          return false;
        },
        formPost: function(url, params) {
          // Creates a form for the given url and parameters, then posts it
          var temp=document.createElement("form");
          temp.action=url;
          temp.method="POST";
          temp.style.display="none";
          for(var x in params) {
            var opt=document.createElement("textarea");
            opt.name=x;
            opt.value=params[x];
            temp.appendChild(opt);
          }
          document.body.appendChild(temp);
          temp.submit();
          return temp;
        },
        build_state: function() {
          var state = [];
          state.push(this.categories.allCategories.toUrl());
          state.push(this.apes.allApes.toUrl());
          state.push(this.species.allSpecies.toUrl());
          state.push(this.regions.allRegions.toUrl());
          state.push(this.countries.allCountries.toUrl());
          state.push(this.slideFilters.toUrl());
          state = _.flatten(state);
          return state.join('|');
        },

        _state_url: function() {
            var self = this;
            //if(self.work_id === undefined) return;
            //var center = self.map.map.get_center();
            //var zoom = self.map.map.get_zoom();
            //var data = [];
            //data.push(zoom, center.lat(), center.lng());
            //var map_pos = data.join(',');

            //var layers = self.map.map.layers;
            //var layer_data = [];
            //var layer_indexes = _.pluck(app.config.MAP_LAYERS,'name');
            //_(self.map.map.layers_order).each(function(name) {
            //    var layer = layers[name];
            //    var idx = _.indexOf(layer_indexes, name);
            //    layer_data.push(idx);
            //    layer_data.push(layer.enabled?1:0);
            //});

            //self.router.navigate('w/' + self.work_id + '/' + map_pos + '|' + layer_data.join(','));
            //self.router.navigate('/' + this.build_state());
        },

        set_state: function(st) {
          var self = this;
          //self.map.map.set_center(new google.maps.LatLng(st.lat,st.lon));
          //self.map.map.set_zoom(st.zoom);
          //_.each(st.layers, function(layer) {
          //  self.map.enable_layer(layer.name, layer.enabled);
          //});
          //self.map.layer_editor.sort_by(st.layers.reverse());
          //self.bus.emit('map:reorder_layers', _.pluck(st.layers, 'name'));
          self.categories.allCategories.fromUrl(st.categories);
          self.apes.allApes.fromUrl(st.apes);
          self.species.allSpecies.fromUrl(st.species);
          self.regions.allRegions.fromUrl(st.region);
          self.countries.allCountries.fromUrl(st.countries);
          self.slideFilters.fromUrl(st.resoDetails, st.bioDetails, st.sizeDetails);
       },

       //State expected format:
       //#categories_ids|apes_ids|species_ids|region_id|countries_ids|ResoSelected,min,max|BioSelected,min,max|SizeSelected,min,max
       //categories_ids= comma spearated integers or -1
       //apes_ids= comma spearated integers or -1
       //species_ids= comma separated integers or -1
       //region_id= an integer or -1
       //countries_ids= comma separated integers or -1
       //ResoSelected= 1 is selected, 0 is not selected - slider min-max
       //BioSelected= 1 is selected, 0 is not selected - slider min-max
       //SizeSelected= 1 is selected, 0 is not selected - slider min-max
       //Only one of Reso, Bio, or Size can be selected at a time
       decode_state: function(state) {
          var states = state.split('|');
          var categories = states[0];
          var apes = states[1];
          var species = states[2];
          var region = states[3];
          var countries = states[4];
          var resoDetails = states[5];
          var bioDetails = states[6];
          var sizeDetails = states[7];

          return {
            categories: categories,
            apes: apes,
            species: species,
            region: region,
            countries: countries,
            resoDetails: resoDetails,
            bioDetails: bioDetails,
            sizeDetails: sizeDetails
          };
       },

       on_route: function(state) {
            //this.map.work_mode();
            if(jQuery.browser.msie === undefined) {
                clearInterval(this.animation);
            }

            app.Log.debug("route: work => ", state);
            /** not for now
            if(state) {
              this.set_state(this.decode_state(state));
            }
            */
       },

        on_route_to: function(route) {
            app.Log.debug("route => ", route);
            this.router.navigate(route, true);
        }

    });
};

jQuery(function($) {
  $("#view-selector .graph").click(function(e) {
    e.stopPropagation();
    $("#results_container").scrollTop(0);
    return false;
  });
  $("#view-selector .map").click(function(e) {
    e.stopPropagation();
    $("#results_container").scrollTop($("#results_container div.map_container").offset().top + $("#results_container").scrollTop() - $("#results_container").offset().top);
    return false;
  });
  $("#view-selector .table").click(function(e) {
    e.stopPropagation();
    $("#results_container").scrollTop($("#results_container #table_header").offset().top + $("#results_container").scrollTop() - $("#results_container").offset().top);
    return false;
  });
}(jQuery));
