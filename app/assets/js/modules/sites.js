/**
 * Site model and collection
*/
App.modules.Sites = function(app) {
  var Site = Backbone.Model.extend({
    defaults: function() {
      return {
        name: null,
        area: null,
        centre_point_x: null,
        centre_point_y: null,
        polygon: null,
        state: null,
        mean_canopy_cover: null,
        pressure: null,
        mean_deforestation: null,
        mean_population_count: null,
        population_change: null,
        mean_human_influence_index: null,
        response: null,
        protected_area: null,
        mean_protection_category: null,
        biodiversity: null,
        species_richness: null,
        proportion_threatened_species: null,
        carbon_storage: null,
        uncertainity: null
      }
    }
  });

  var AllSites = Backbone.Collection.extend({
    model: Site,
    initialize: function() {
      this.size = {};
      this.response = {};
      this.biodiversity = {};
      this.uncertainity = {};
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

      return "json/sites_stats.json?" + jQuery.param(params);
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

  app.Sites = Class.extend({
    init: function() {
      // Initialise the sites collections
      this.allSites = new AllSites();
      this.allSites.fetch();
    }
  });
}
