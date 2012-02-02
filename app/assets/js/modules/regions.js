/**
 * Region model and collection
*/
App.modules.Regions = function(app) {
    var Region = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  false,
              the_type: "regions"
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
            return this.filter(function(region){ return region.get('selected'); });
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

