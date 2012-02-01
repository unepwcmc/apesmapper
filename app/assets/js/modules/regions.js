/**
 * Region model and collection
*/
App.modules.Regions = function(app) {
    var Region = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  false
            };
        },
        toggle: function() {
          this.set({selected: !this.get("selected")});
        },
        idAttribute: 'id'
    });

    var AllRegions = Backbone.Collection.extend({
        model: Region,
        url: 'json/regions.json',
        selected: function() {
            return this.filter(function(country){ return country.get('selected'); });
        }
    });

    app.Regions = Class.extend({
        init: function() {
            // Initialise the regions collections
            this.allRegions = new AllRegions();
            this.allRegions.fetch();
        }
    });
}

