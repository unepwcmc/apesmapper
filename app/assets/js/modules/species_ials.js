/**
 * Site model and collection
*/
App.modules.SpeciesIals = function(app) {
  var SpeciesIal = Backbone.Model.extend({
    defaults: function() {
      return {
        area_km: null,
        state_score: null,
        pressure_score: null
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
    selectQuery: function() {
      // Build the SQL query to filter species_ials
      var sqlQuery = "SELECT * FROM species_ials",
        params = [];

      if(typeof this.size.min !== undefined && this.size.max !== undefined) {
        params = params.concat("(area_km >= " + this.size.min * 1000 + " AND area_km <= " + this.size.max * 1000 + ")");
      }
      if(typeof this.response.min !== undefined && this.response.max !== undefined) {
        params = params.concat("(response_score >= " + (this.response.min / 100) + " AND response_score <= " + (this.response.max / 100) + ")");
      }
      if(typeof this.biodiversity.min !== undefined && this.biodiversity.max !== undefined) {
        params = params.concat("(biodiversity_score >= " + (this.biodiversity.min / 100) + " AND biodiversity_score <= " + (this.biodiversity.max / 100) + ")");
      }
      if(typeof this.uncertainity.min !== undefined && this.uncertainity.max !== undefined) {
        params = params.concat("(uncertainity >= " + (this.uncertainity.min / 100) + " AND uncertainity <= " + (this.uncertainity.max / 100) + ")");
      }

      if(params.length > 0) {
        sqlQuery = sqlQuery + " WHERE " + params.join(" AND ");
      }

      return sqlQuery
    },
    url: function() {
      // cartoDB query used by fetch
      return "https://carbon-tool.cartodb.com/api/v1/sql?q=" + this.selectQuery();
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
      this.fetch({add: false});
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
