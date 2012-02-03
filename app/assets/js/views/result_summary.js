/*
 * Render the summary of the results
 * Currently this purely involves printing the number of results
 */
App.views.ResultSummary = Backbone.View.extend({
  el: 'span#result-strip',
  template: JST['_result_summary'],

  initialize: function() {
    _.bindAll(this, 'render');

    this.species_ials = this.options.species_ials;
    this.species_ials.bind("all", this.render);
  },

  render: function() {
    var renderedContent = this.template({
      result_count: this.species_ials.models.length,
      plural: this.species_ials.models.length === 1 ? '' : 's'
    });
    jQuery(this.el).html(renderedContent);
  }
});
