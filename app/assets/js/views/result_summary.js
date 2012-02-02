/*
 * Render the summary of the results
 * Currently this purely involves printing the number of results
 */
App.views.ResultSummary = Backbone.View.extend({
  el: 'span#result-count',

  initialize: function() {
    _.bindAll(this, 'render');

    this.species_ials = this.options.species_ials;
    this.species_ials.bind("all", this.render);
  },

  render: function() {
    jQuery(this.el).html(this.species_ials.models.length);
  }
});
