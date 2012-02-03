/**
 * Species model and collection
*/
App.modules.Species = function(app) {
    var Species = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  false,
              the_type: "species",
              hidden: false
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
        url: 'json/species_t.json',
        selected: function() {
            return this.filter(function(species){ return species.get('selected'); });
        },
        toUrl: function() {
          var selected_ids = this.selected().map(function(species){ return species.get('id').toString();});
          return _.size(selected_ids) > 0 ? selected_ids.join(",") : "0";
        },
        filterByApe: function(ape_id){
          return this.ape_id == ape_id;
        },
        visible: function() {
          return this.filter(function(species) { return species.get('hidden') == false; })
        },
        setSelectedFromIds: function(species_ids){
          species_array = species_ids.split(',');
          this.species.each(function(species_ids){
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
            this.allSpecies.fetch();
        }
    });
};
