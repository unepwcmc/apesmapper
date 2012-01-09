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
        // Initialise the apes collection
        this.allApes = new AllApes();
        this.allApes.fetch();
      }
    })
}
