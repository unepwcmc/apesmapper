/*
 * View the currently selected filters (species and countries)
 */
App.views.SlideFilters = Backbone.View.extend({
  el: 'div#slide_filters',

  events: {
    'slidestop div.filter-slider': 'stop_slider'
  },

  initialize: function() {
    _.bindAll(this, 'render', 'stop_slider');

    this.bus = this.options.bus;
    this.species = this.options.species;
    this.countries = this.options.countries;
    this.sites = this.options.sites;
    this.species_ials = this.options.species_ials;
    this.species_ials_table = this.options.species_ials_table;
    this.bus.on('save_filter:click', this.render);

    // Sliders
    jQuery("div.filter-slider").slider({
      range: true,
      min: 0,
      max: 100,
      values: [0, 100]
    });
  },

  enable_select: function() {
    // Enables saving the filter changes
    jQuery('#save_filter span.button_info').text('Filter');
    jQuery('#save_filter').removeAttr('disabled');
  },
  
  stop_slider: function(event, ui) {
    if(jQuery(event.target).hasClass("response")) {
      this.species_ials.filterByResponse(ui.values[0], ui.values[1])
      this.species_ials_table.filterByResponse(ui.values[0], ui.values[1])
    } else if(jQuery(event.target).hasClass("biodiversity")) {
      this.species_ials.filterByBiodiversity(ui.values[0], ui.values[1])
      this.species_ials_table.filterByBiodiversity(ui.values[0], ui.values[1])
    } else if(jQuery(event.target).hasClass("uncertainity")) {
      this.species_ials.filterByUncertainity(ui.values[0], ui.values[1])
      this.species_ials_table.filterByUncertainity(ui.values[0], ui.values[1])
    } else if(jQuery(event.target).hasClass("size")) {
      this.species_ials.filterBySize(ui.values[0], ui.values[1])
      this.species_ials_table.filterBySize(ui.values[0], ui.values[1])
    }
  }
});
