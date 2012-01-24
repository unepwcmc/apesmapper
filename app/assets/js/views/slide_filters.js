/*
 * View the currently selected filters (apes and countries)
 */
App.views.SlideFilters = Backbone.View.extend({
  el: 'div#slide_filters',

  events: {
    'click #edit_filter': 'hide',
    'slidestop div.filter-slider': 'stop_slider'
  },

  initialize: function() {
    _.bindAll(this, 'render', 'stop_slider');

    this.bus = this.options.bus;
    this.apes = this.options.apes;
    this.countries = this.options.countries;
    this.sites = this.options.sites;
    this.bus.on('save_filter:click', this.render);

    this.sites.bind("all", this.render);

    // Sliders
    jQuery("div.filter-slider").slider({
      range: true,
      min: 0,
      max: 100,
      values: [0, 100]
    });
  },

  addAll: function() {
    jQuery("#results-table tbody").empty();
    this.sites.each(this.addOne);
  },

  addOne: function(site) {
    var colors = ['#F5F5DC', '#0000FF', '#0095B6', '#8A2BE2', '#CD7F32', '#964B00', '#702963', '#960018', '#DE3163', '#007BA7', '#F7E7CE', '#7FFF00', '#6F4E37', '#B87333', '#F88379', '#DC143C', '#00FFFF', '#EDC9AF'];
    window.bubbleChart.addBubble(site.get('state')*100, site.get('pressure')*100, site.get('area'), colors[Math.floor(Math.random()*colors.length)], site.get('name'));

    var view = new App.views.FilterView({model : site});
    jQuery("#results-table tbody").append(view.render().el);
  },

  render: function() {
    jQuery("#results-table tbody").html("");
    window.bubbleChart.empty();

    this.addAll();

    window.bubbleChart.redraw();

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

