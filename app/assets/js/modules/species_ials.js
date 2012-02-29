/**
 * Site model and collection
*/
App.modules.SpeciesIals = function(app) {
  var SpeciesIal = Backbone.Model.extend({
    defaults: function() {
      return {
        area_km2: null,
        habitat_score: null,
        pressure_score: null,
        response_score: 0,
        biodiversity_score: 0,
        uncertainty_score: 0
      };
    },
    idAttribute: 'cartodb_id'
  });

  var AllSpeciesIals = Backbone.Collection.extend({
    model: SpeciesIal,
    initialize: function() {
      _.bindAll(this, 'selectCountries', 'selectSpecies');

      this.size = {};
      this.response = {};
      this.biodiversity = {};
      this.filter_selected = 'response';
      this.countries = [];
      this.species = [];
    },
    parse: function(response) {
      // CartoDB returns results in rows field
      response || (response = {});
      response = response.rows;
      return Backbone.Collection.prototype.parse.call(this, response);
    },
    aggregateSelectSql: function() {
      // Returns the SQL from string to get the aggregated scores for the site_ials
      var selectSql = " species_ials.site ial_id,";
      selectSql = selectSql + " species_ials.habitat_score as habitat_score,";
      selectSql = selectSql + " species_ials.biodiversity_score as biodiversity_score,";
      selectSql = selectSql + " species_ials.pressure_score as pressure_score,";
      selectSql = selectSql + " species_ials.response_score response_score,";
      selectSql = selectSql + " species_ials.uncertainty_score as uncertainty_score,";
      selectSql = selectSql + " species_ials.area_km2 as area_km2,";
      selectSql = selectSql + " species_ials.species as species, ";
      selectSql = selectSql + " ials.category as category ";
      return selectSql;
    },
    filterConditionsSql: function (){
      // Where clause based on the current filtering
      var params = [], conditionsSql = "";

      if(typeof this.size.min !== undefined && this.size.max !== undefined) {
        params = params.concat("(species_ials.area_km2 >= " + this.size.min * 1000 + " AND species_ials.area_km2 <= " + this.size.max * 1000 + ")");
      }
      if(typeof this.response.min !== undefined && this.response.max !== undefined) {
        params = params.concat("(species_ials.response_score >= " + (this.response.min / 100) + " AND species_ials.response_score <= " + (this.response.max / 100) + ")");
      }
      if(typeof this.biodiversity.min !== undefined && this.biodiversity.max !== undefined) {
        params = params.concat("(species_ials.biodiversity_score >= " + (this.biodiversity.min / 100) + " AND species_ials.biodiversity_score <= " + (this.biodiversity.max / 100) + ")");
      }
      if(this.countries.length > 0) {
        params = params.concat("(site IN (" + this.countries.join(",") + "))");
      }
      if(this.species.length > 0) {
        params = params.concat("(species IN ('" + this.species.join("','") + "'))");
      }

      if(params.length > 0) {
        conditionsSql = " WHERE " + params.join(" AND ");
      }

      return conditionsSql;
    },
    aggregateFromSql: function() {
      // Get the species_ial with the maximum pressure and use that to filter the site values
      var sql =  "FROM";
      sql = sql + "  (SELECT MAX(pressure_score) AS max_pressure, site FROM species_ials ";
      sql = sql + this.filterConditionsSql();
      sql = sql + "    GROUP BY site) AS max_values,";
      sql = sql + "  species_ials ";
      sql = sql + " INNER JOIN ials ON ials.ial_id = species_ials.site ";
      sql = sql + "WHERE";
      sql = sql + "  (max_values.max_pressure = species_ials.pressure_score AND max_values.site = species_ials.site) ";
      return sql;
    },
    selectQuery: function() {
      // Build the SQL query to filter species_ials
      var sqlQuery = "SELECT ";
      sqlQuery = sqlQuery + this.aggregateSelectSql();
      sqlQuery = sqlQuery + this.aggregateFromSql();
      return sqlQuery;
    },
    geoQuery: function() {
      // returns the SQL query to be used for the maps
      var sqlQuery = "SELECT ";
      sqlQuery = sqlQuery + " ials.the_geom_webmercator, ials.cartodb_id ";
      sqlQuery = sqlQuery + " FROM ials";
      sqlQuery = sqlQuery + " INNER JOIN species_ials ON ials.ial_id = species_ials.site";

      sqlQuery = sqlQuery + this.filterConditionsSql();

      sqlQuery = sqlQuery + " GROUP BY ials.the_geom_webmercator, ials.cartodb_id";

      return sqlQuery;
    },
    ialsJoinAndFilterConditions: function() {
      // returns the join and conditions SQL
      var sqlQuery = "";
      sqlQuery = sqlQuery + " INNER JOIN species_ials ON ials.ial_id = species_ials.site";

      sqlQuery = sqlQuery + this.filterConditionsSql();

      return sqlQuery;
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
    selectFilter: function(filter_selected) {
      if(this.filter_selected == filter_selected) {
        return false;
      }

      this.filter_selected = filter_selected;
      this.trigger("change:filter");
      return true;
    },
    selectCountries: function(countries) {
      this.countries = countries;
      this.fetch({add: false});
      return true;
    },
    selectSpecies: function(species) {
      this.species = species;
      this.fetch({add: false});
      return true;
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
