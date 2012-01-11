/**
 * Ape model and collection
*/
App.modules.Apes = function(app) {
    var Ape = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  false,
            };
        }
    });

    var AllApes = Backbone.Collection.extend({
        model: Ape,
        url: 'json/apes.json',
        selected: function() {
            var selection = [];
            this.each(function(ape) {
                if (ape.get('selected')){
                    selection.push(ape);
                }
            });
            return selection;
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
