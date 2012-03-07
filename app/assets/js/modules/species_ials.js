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
      var selectSql = " species_ials.site as ial_id,";
      selectSql = selectSql + " species_ials.habitat_score as habitat_score,";
      selectSql = selectSql + " species_ials.biodiversity_score as biodiversity_score,";
      selectSql = selectSql + " species_ials.pressure_score as pressure_score,";
      selectSql = selectSql + " species_ials.response_score response_score,";
      selectSql = selectSql + " species_ials.uncertainty_score as uncertainty_score,";
      selectSql = selectSql + " species_ials.area_km2 as area_km2,";
      selectSql = selectSql + " species_ials.species as species, ";
      selectSql = selectSql + " species_ials.taxon_site_overlap as taxon_site_overlap, ";
      selectSql = selectSql + " ials.name as name, ";
      selectSql = selectSql + " ials.category as category ";
      return selectSql;
    },
    filterConditionsSql: function (){
      // Where clause based on the current filtering
      var params = [], sqlFragment = '', conditionsSql = "", countries, joinSql = "";

      // Add join to filter by country
      joinSql = " INNER JOIN countries_ials ON species_ials.site = countries_ials.ial_id ";

      if(typeof this.size.min !== undefined && this.size.max !== undefined) {
        params = params.concat("(species_ials.area_km2 >= " + this.size.min + " AND species_ials.area_km2 <= " + this.size.max + ")");
      }
      if(typeof this.response.min !== undefined && this.response.max !== undefined) {
        params = params.concat("(species_ials.response_score >= " + this.response.min + " AND species_ials.response_score <= " + this.response.max + ")");
      }
      if(typeof this.biodiversity.min !== undefined && this.biodiversity.max !== undefined) {
        params = params.concat("(species_ials.biodiversity_score >= " + this.biodiversity.min + " AND species_ials.biodiversity_score <= " + this.biodiversity.max + ")");
      }

      countries = this.countries;
      if(countries.length === 0) {
        // If no countries are selected, return nothing
        countries = [-1];
      }
      params = params.concat("(countries_ials.country_id IN (" + countries.join(",") + "))");

      if(this.species.length > 0) {
        params = params.concat("(species IN ('" + this.species.join("','") + "'))");
      }

      // Add active filters (This should really have a view and not query the DOM...)
      if($("a.filter_by.active").length > 0){
        sqlFragment = "(species_ials.category IN (";
        var fragments = [];
        $("a.filter_by.active").each(function(){
          fragments.push( "'" + $(this).text() + "'");
        });
        sqlFragment = sqlFragment + fragments.join(',') + "))";
        params = params.concat(sqlFragment);
      }

      if(params.length > 0) {
        conditionsSql = joinSql + " WHERE " + params.join(" AND ");
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
    speciesOccurrenceQuery: function() {
      // Build the SQL query to get the species occurrences for the download
      var sqlQuery = "SELECT ";
      sqlQuery = sqlQuery + " species_ials.site as ial_id, ";
      sqlQuery = sqlQuery + " ials.name as name, ";
      sqlQuery = sqlQuery + " ials.category as category, ";
      sqlQuery = sqlQuery + " species_ials.area_km2 as area_km2,";
      sqlQuery = sqlQuery + " species_ials.species as taxon,";
      sqlQuery = sqlQuery + " species_ials.taxon_site_overlap as taxon_site_overlap, ";
      sqlQuery = sqlQuery + " species_ials.pressure_score as pressure_score,";
      sqlQuery = sqlQuery + " species_ials.main_pressure as main_pressure,";
      sqlQuery = sqlQuery + " species_ials.habitat_score as habitat_score,";
      sqlQuery = sqlQuery + " species_ials.response_score response_score,";
      sqlQuery = sqlQuery + " species_ials.biodiversity_score as biodiversity_score,";
      sqlQuery = sqlQuery + " species_ials.uncertainty_score as uncertainty_score,";
      sqlQuery = sqlQuery + " species_ials.habitat_suitability_score_2000 as habitat_suitability,";
      sqlQuery = sqlQuery + " species_ials.mean_forest_cover_2005 as mean_forest_cover,";
      sqlQuery = sqlQuery + " species_ials.mean_deforestation_2000__2005 as mean_deforestation,";
      sqlQuery = sqlQuery + " species_ials.mean_human_influence_index_2000 as mean_human_influence_index,";
      sqlQuery = sqlQuery + " species_ials.mean_population_count_2000 as mean_human_influence_index,";
      sqlQuery = sqlQuery + " species_ials.mean_population_change_1990__2000 as mean_population_change,";
      sqlQuery = sqlQuery + " species_ials.protection_extent as protection_extent,";
      sqlQuery = sqlQuery + " species_ials.proportion_msr_threatened as proportion_msr_threatened,";
      sqlQuery = sqlQuery + " species_ials.mean_carbon_stock as mean_carbon_stock,";
      sqlQuery = sqlQuery + " species_ials.additional_information as additional_information ";
      sqlQuery = sqlQuery + " FROM species_ials ";
      sqlQuery = sqlQuery + " INNER JOIN ials ON ials.ial_id = species_ials.site";
      sqlQuery = sqlQuery + this.filterConditionsSql();
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
    },
    filterParams: function() {
      // Returns the filter parameters in a JS object
      return {
        sizeMin: this.size.min,
        sizeMax: this.size.max,
        responseMin: this.response.min,
        responseMax: this.biodiversity.max,
        biodiversityMin: this.response.min,
        biodiversityMax: this.biodiversity.max,
        countries: this.countries,
        species: this.species
      };
    }
  });

  var SpeciesIalsMinMax = Backbone.Model.extend({
    defaults: function() {
      return {
        region: null,
        min_area: null,
        max_area: null,
      };
    }
  });

  var AllSpeciesIalsMinMax = Backbone.Collection.extend({
    model: SpeciesIalsMinMax,
    initialize: function() {
      this.region_id = null;
      this.minArea = 0;
      this.maxArea = 0;
    },
    url: function() {
      // cartoDB query used by fetch
      return "https://carbon-tool.cartodb.com/api/v1/sql?q=" + this.selectQuery();
    },
    parse: function(response) {
      // CartoDB returns results in rows field
      response || (response = {});
      response = response.rows;
      var region = (this.region_id == 1 ? 'Africa' : 'Asia');
      var regionMinMax = _.find(response, function(record){
      	if (record['region'] == region){
      	  return true;
      	}
      });

      this.minResponse = regionMinMax['min_response'];
      this.maxResponse = regionMinMax['max_response'];	
      this.minBiodiversity = regionMinMax['min_biodiversity'];
      this.maxBiodiversity = regionMinMax['max_biodiversity'];	
      this.minArea = regionMinMax['min_area'];
      this.maxArea = regionMinMax['max_area'];	

      return Backbone.Collection.prototype.parse.call(this, response);
    },
    selectQuery: function() {
      var sqlQuery = "SELECT region, MIN(area_km2) AS min_area, MAX(area_km2) AS max_area, ";
      sqlQuery = sqlQuery + " MIN(response_score) AS min_response, MAX(response_score) AS max_response, ";
      sqlQuery = sqlQuery + " MIN(biodiversity_score) AS min_biodiversity, MAX(biodiversity_score) AS max_biodiversity ";
      sqlQuery = sqlQuery + " FROM species_ials GROUP BY region";
      return sqlQuery;
    },
    idAttribute: 'cartodb_id'
  });

  app.SpeciesIals = Class.extend({
    init: function() {
      // Initialise the sites collections
      this.allSpeciesIals = new AllSpeciesIals();
      this.allSpeciesIalsMinMax = new AllSpeciesIalsMinMax();
    }
  });
}
