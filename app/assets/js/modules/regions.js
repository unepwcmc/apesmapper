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
        },
        toUrl: function() {
          var selected_ids = this.selected().map(function(region){ return region.get('id').toString();});
          return _.size(selected_ids) > 0 ? selected_ids.join(",") : "0";
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

