/*
 * View the currently selected filters (apes and countries)
 */
App.views.SlideFilters = Backbone.View.extend({
  el: 'div#slide_filters',

  events: {
    'slidestop div.filter-slider': 'stop_slider'
  },

  initialize: function() {
    _.bindAll(this, 'render', 'stop_slider');

    this.bus = this.options.bus;
    this.apes = this.options.apes;
    this.countries = this.options.countries;
    this.sites = this.options.sites;
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
      this.sites.filterByResponse(ui.values[0], ui.values[1])
    } else if(jQuery(event.target).hasClass("biodiversity")) {
      this.sites.filterByBiodiversity(ui.values[0], ui.values[1])
    } else if(jQuery(event.target).hasClass("uncertainity")) {
      this.sites.filterByUncertainity(ui.values[0], ui.values[1])
    } else if(jQuery(event.target).hasClass("size")) {
      this.sites.filterBySize(ui.values[0], ui.values[1])
    }
  }
});

