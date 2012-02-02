/*
 * View the currently selected filters (species and countries)
 */
App.views.SelectedSpeciesCountries = Backbone.View.extend({
  el: 'ul#species-countries-selected',

  events: {
    'click span#edit-selected-species': 'showCategoriesEditor',
    'click span#edit-selected-countries': 'showRegionsSelector'
  },

  initialize: function() {
    _.bindAll(this, 'render', 'showCategoriesEditor');

    this.bus = this.options.bus;
    this.species = this.options.species;
    this.countries = this.options.countries;

    this.species.bind("change", this.render);
    this.countries.bind("change", this.render);

    this.template = _.template( jQuery("script#species-countries-selected-tmpl").html() );

    this.render();
  },

  render: function() {
    // render the template
    var renderedContent = this.template({
      species_count: this.species.selected().length,
      countries_count: this.countries.selected().length
    });
    jQuery(this.el).html(renderedContent);
    return this;
  },

  showCategoriesEditor: function() {
    // Show the species edit view
    this.bus.emit('show_categories_editor');
  },
  showRegionsSelector: function() {
    // Show the countries edit view
    this.bus.emit('show_regions_selector');
  }
});
