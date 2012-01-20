/*
 * View the currently selected filters (apes and countries)
 */
App.views.SelectedApesCountries = Backbone.View.extend({
  el: 'ul#apes-countries-selected',

  events: {
    'click span#edit-selected-species': 'showSpeciesEditor'
  },

  initialize: function() {
    _.bindAll(this, 'render', 'showSpeciesEditor');

    this.bus = this.options.bus;
    this.apes = this.options.apes;
    this.countries = this.options.countries;

    this.apes.bind("change", this.render);
    this.countries.bind("change", this.render);

    this.template = _.template( jQuery("script#apes-countries-selected-tmpl").html() );

    this.render();
  },

  render: function() {
    // render the template
    var renderedContent = this.template({
      apes_count: this.apes.selected().length,
      countries_count: this.countries.selected().length
    });
    jQuery(this.el).html(renderedContent);
    return this;
  },

  showSpeciesEditor: function() {
    // Show the species edit view
    this.bus.emit('show_species_editor');
  }
});
