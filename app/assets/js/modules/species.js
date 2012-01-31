/**
 * Species model and collection
*/
App.modules.Species = function(app) {
    var Species = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  false,
            };
        },
        toggle: function() {
          this.set({selected: !this.get("selected")});
        },
        toTemplateJson: function(){

        }
    });

    var AllSpecies = Backbone.Collection.extend({
        model: Species,
        url: 'json/species.json',
        initialize: function(){
          _.bindAll(this, 'createCategories');
          this.bind('reset', this.createCategories);

          this.apes = {};
        },
        selected: function() {
            return this.filter(function(species){ return species.get('selected'); });
        },
        createCategories: function() {
          // Build categories and family collections
          var that = this;
          this.each(function(species) {
            if (!that.apes[species.get('ape')]){
              that.apes[species.get('ape')] = 2;
            }
          });
        }
    });

    var SpeciesCategories = Backbone.Collection.extend({
    });
    var SpeciesApes = Backbone.Collection.extend({
    });
    app.Species = Class.extend({
        init: function() {
            // Initialise the species collections
            this.allSpecies = new AllSpecies();
            this.allSpecies.fetch();
        }
    });
};
