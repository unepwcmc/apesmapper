/*
 * View the currently selected filters (species and countries)
 */
App.views.EditSelectedSpeciesView = Backbone.View.extend({
  el: 'div#slide_filters',

  events: {
    'click #edit_filter': 'hide',
    'slidestop div.filter-slider': 'stop_slider'
  },

  initialize: function() {
    _.bindAll(this, 'render', 'stop_slider');

    this.bus = this.options.bus;
    this.species = this.options.species;
    this.countries = this.options.countries;
    this.sites = this.options.sites;
    this.bus.on('save_filter:click', this.render);

    this.species.bind("change", this.render);
    this.countries.bind("change", this.render);

    // Sliders
    jQuery("div.filter-slider").slider({
      range: true,
      min: 0,
      max: 100,
      values: [0, 100]
    });
    // TODO change bindings
  },

  render: function() {
    return this;
  },

  show: function() {
    this.el.show();
  },

  hide: function() {
    //this.el.hide();
    this.bus.emit('edit_filter:click');
  },

  enable_select: function() {
    // Enables saving the filter changes
    jQuery('#save_filter span.button_info').text('Filter');
    jQuery('#save_filter').removeAttr('disabled');
  },
  
  stop_slider: function(event, ui) {
    if(jQuery(event.target).hasClass("response")) {
      this.sites.filterByResponse(ui.values[0], ui.values[1]);
    } else if(jQuery(event.target).hasClass("biodiversity")) {
      this.sites.filterByBiodiversity(ui.values[0], ui.values[1]);
    } else if(jQuery(event.target).hasClass("size")) {
      this.sites.filterBySize(ui.values[0], ui.values[1]);
    }
  }
});
