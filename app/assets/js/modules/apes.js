/**
 * Ape model and collection
*/
App.modules.Apes = function(app) {
    var Ape = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  false,
            };
        },
        idAttribute: 'ape_id'
    });

    var AllApes = Backbone.Collection.extend({
        model: Ape,
        url: 'json/apes.json',
        initialize: function(){
        },
        selected: function() {
            //return this.filter(function(species){ return species.get('selected'); });
        },
    });

    app.Apes = Class.extend({
        init: function() {
            // Initialise the species collections
            this.allApes = new AllApes();
            this.allApes.fetch();
        }
    });
};

