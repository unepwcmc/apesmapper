/**
 * Species model and collection
*/
App.modules.Species = function(app) {
    var Species = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  true,
              the_type: "species",
              hidden: false,
              show_next: false,
              code: null
            };
        },
        toggle: function() {
          this.set({selected: !this.get("selected")});
        },
        toTemplateJson: function(){

        },
        idAttribute: 'id'
    });

    var AllSpecies = Backbone.Collection.extend({
        model: Species,
        url: function() {
          return 'json/regions/' + this.region_id + '/species.json';
        },
        selected: function() {
            return this.filter(function(species){ return species.get('selected'); });
        },
        toUrl: function() {
          var selected_ids = this.selected().map(function(species){ return species.get('id').toString();});
          return _.size(selected_ids) > 0 ? selected_ids.join(",") : "0";
        },
        fromUrl: function() {
        },
        filterByApe: function(ape_id){
          return this.ape_id == ape_id;
        },
        filterByRegion: function(region_id){
          return this.filter(function(species){return species.get('region_id') == region_id;})
        },
        filterByCountry: function(country_id){
          return this.filter(function(species){return _.include(species.get("country_id").split(','), country_id);})
        },
        visible: function() {
          return this.filter(function(species) { return species.get('hidden') == false; })
        },
        setSelectedFromIds: function(species_ids){
          species_array = species_ids.split(',');
          this.species.each(function() {
            if(_.include(species_array, this.get('id'))){
              this.set({'selected': true})
            }
          });
        }
    });

    app.Species = Class.extend({
        init: function() {
            // Initialise the species collections
            this.allSpecies = new AllSpecies();
        }
    });
};