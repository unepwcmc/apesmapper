/**
 * Ape model and collection
*/
App.modules.Apes = function(app) {
    var Ape = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  false,
              the_type: "ape",
              hidden: false
            };
        },
        toggle: function() {
          this.set({selected: !this.get("selected")});
        },
        idAttribute: 'ape_id'
    });

    var AllApes = Backbone.Collection.extend({
        model: Ape,
        url: 'json/apes.json',
        selected: function() {
            return this.filter(function(ape){ return ape.get('selected'); });
        },
        filterByCategory: function(category_id){
          return this.filter(function(apes){ return apes.get('category_id') == category_id;})
        },
        visible: function() {
          return this.filter(function(ape) { return ape.get('hidden') == false; })
        }
    });

    app.Apes = Class.extend({
        init: function() {
            // Initialise the species collections
            this.allApes = new AllApes();
            this.allApes.fetch();
        }
    });
};

