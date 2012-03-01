/**
 * Ape model and collection
*/
App.modules.Countries = function(app) {
    var Country = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  false,
              hidden: false,
              the_type: "countries"
            };
        },
        toggle: function() {
          this.set({selected: !this.get("selected")});
        },
        idAttribute: 'id'
    });

    var AllCountries = Backbone.Collection.extend({
        model: Country,
        url: function() {
          return 'json/regions/' + this.region_id + '/countries.json';
        },
        selected: function() {
            return this.filter(function(country){ return country.get('selected'); });
        },
        toUrl: function() {
          var selected_ids = this.selected().map(function(country){ return country.get('id').toString();});
          return _.size(selected_ids) > 0 ? selected_ids.join(",") : "0";
        },
        fromUrl: function() {
        },
        visible: function() {
          return this.filter(function(country) { return country.get('hidden') === false; });
        }
    });

    app.Countries = Class.extend({
        init: function() {
            // Initialise the countries collections
            this.allCountries = new AllCountries();
        }
    });
}
