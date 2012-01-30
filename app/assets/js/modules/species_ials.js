/**
 * Site model and collection
*/
App.modules.SpeciesIals = function(app) {
  var SpeciesIal = Backbone.Model.extend({
    defaults: function() {
      return {
        area_km: null
      }
    },
    idAttribute: 'cartodb_id'
  });

  var AllSpeciesIals = Backbone.Collection.extend({
    model: SpeciesIal,
    initialize: function() {
      this.size = {};
      this.response = {};
      this.biodiversity = {};
      this.uncertainity = {};
    },
    parse: function(response) {
      // CartoDB returns results in rows field
      response || (response = {});
      response = response.rows;
      return Backbone.Collection.prototype.parse.call(this, response);
    },
    url: function() {
      params = {};
      if(typeof this.size.min !== undefined && this.size !== null) {
        params.size_min = this.size.min;
        params.size_max = this.size.max;
      }
      if(typeof this.response !== "undefined" && this.response !== null) {
        params.response_min = this.response.min;
        params.response_max = this.response.max;
      }
      if(typeof this.biodiversity !== "undefined" && this.biodiversity !== null) {
        params.biodiversity_min = this.biodiversity.min;
        params.biodiversity_max = this.biodiversity.max;
      }

      var sqlQuery = "SELECT * FROM species_ials";
      return "https://carbon-tool.cartodb.com/api/v1/sql?q=" + sqlQuery;
    },
    filterBySize: function(min, max) {
      if(this.size.min === min && this.size.max === max) {
        return false;
      }

      this.size = {min: min, max: max};
      this.fetch({add: false});
      return true;
    },
    resetSize: function() {
      this.size = {};
      this.fetch({add: false});
    },
    filterByResponse: function(min, max) {
      if(this.response.min === min && this.response.max === max) {
        return false;
      }

      this.response = {min: min, max: max};
      this.fetch({add: false, success: function(e) {
      }, error: function(e) {
      }});
      return true;
    },
    resetResponse: function() {
      this.response = {};
      this.fetch({add: false});
    },
    filterByBiodiversity: function(min, max) {
      if(this.biodiversity.min === min && this.biodiversity.max === max) {
        return false;
      }

      this.biodiversity = {min: min, max: max};
      this.fetch({add: false});
      return true;
    },
    resetBiodiversity: function() {
      this.biodiversity = {};
      this.fetch({add: false});
    },
    filterByUncertainity: function(min, max) {
      if(this.uncertainity.min === min && this.uncertainity.max === max) {
        return false;
      }

      this.uncertainity = {min: min, max: max};
      this.fetch({add: false});
      return true;
    },
    resetUncertainity: function() {
      this.uncertainity = {};
      this.fetch({add: false});
    }
  });

  app.SpeciesIals = Class.extend({
    init: function() {
      // Initialise the sites collections
      this.allSpeciesIals = new AllSpeciesIals();
      this.allSpeciesIals.fetch();
    }
  });
}
