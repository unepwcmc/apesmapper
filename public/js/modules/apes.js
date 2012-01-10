/**
 * Ape model and collection
*/
App.modules.Apes = function(app) {
    var Ape = Backbone.Model.extend({
    });

    var AllApes = Backbone.Collection.extend({
      model: Ape,
      url: 'json/apes.json'
    });

    app.Apes = Class.extend({
      init: function() {
        // Initialise the apes collections
        this.allApes = new AllApes();
        // create the species selector view
        this.speciesSelector = new SpeciesSelector({collection: this.allApes});
        this.allApes.fetch();
      }
    });
}
