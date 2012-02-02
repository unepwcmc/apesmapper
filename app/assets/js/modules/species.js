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
        filterByApe: function(ape_id){
          return this.ape_id == ape_id;
        },
        visible: function() {
          return this.filter(function(species) { return species.get('hidden') == false; })
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
