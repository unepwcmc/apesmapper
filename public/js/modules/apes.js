/**
 * Ape model and collection
*/
App.modules.Apes = function(app) {
    var Ape = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  false
            };
        },
        toggle: function() {
          this.set({selected: !this.get("selected")});
        }
    });

    var AllApes = Backbone.Collection.extend({
        model: Ape,
        url: 'json/apes.json',
        selected: function() {
            return this.filter(function(ape){ return ape.get('selected'); });
        }
    });

    app.Apes = Class.extend({
        init: function() {
            // Initialise the apes collections
            this.allApes = new AllApes();
            this.allApes.fetch();
        }
    });
}
