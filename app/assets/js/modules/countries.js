/**
 * Ape model and collection
*/
App.modules.Countries = function(app) {
    var Country = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  false,
              hidden: false
            };
        },
        toggle: function() {
          this.set({selected: !this.get("selected")});
        },
        idAttribute: 'id'
    });

    var AllCountries = Backbone.Collection.extend({
        model: Country,
        url: 'json/countries.json',
        selected: function() {
            return this.filter(function(country){ return country.get('selected'); });
        },
        filterByRegion: function(region_id){
          return this.filter(function(country){ return country.get('region_id') == region_id;})
        },
        visible: function() {
          return this.filter(function(country) { return country.get('hidden') == false; })
        }
    });

    app.Countries = Class.extend({
        init: function() {
            // Initialise the countries collections
            this.allCountries = new AllCountries();
            this.allCountries.fetch();
        }
    });
}
