/*
 * View the currently selected filters (species and countries)
 */
App.views.SlideFilters = Backbone.View.extend({
  el: 'div#slide_filters',

  events: {
    'slidestop div.filter-slider': 'stop_slider',
    'click ul.filters li': 'select_filter'
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
      this.species_ials.filterByResponse(ui.values[0], ui.values[1]);
      this.species_ials_table.filterByResponse(ui.values[0], ui.values[1]);
    } else if(jQuery(event.target).hasClass("biodiversity")) {
      this.species_ials.filterByBiodiversity(ui.values[0], ui.values[1]);
      this.species_ials_table.filterByBiodiversity(ui.values[0], ui.values[1]);
    } else if(jQuery(event.target).hasClass("uncertainty")) {
      this.species_ials.filterByUncertainty(ui.values[0], ui.values[1]);
      this.species_ials_table.filterByUncertainty(ui.values[0], ui.values[1]);
    } else if(jQuery(event.target).hasClass("size")) {
      this.species_ials.filterBySize(ui.values[0], ui.values[1]);
      this.species_ials_table.filterBySize(ui.values[0], ui.values[1]);
    }
  },

  select_filter: function(event) {
    if(jQuery(event.target).hasClass("response")) {

      this.species_ials.selectFilter("response")
      jQuery(event.target).siblings('li').removeClass("active");
      jQuery(event.target).addClass("active");

    } else if(jQuery(event.target).hasClass("biodiversity")) {

      this.species_ials.selectFilter("biodiversity")
      jQuery(event.target).siblings('li').removeClass("active");
      jQuery(event.target).addClass("active");

    } else if(jQuery(event.target).hasClass("uncertainty")) {

      this.species_ials.selectFilter("uncertainty")
      jQuery(event.target).siblings('li').removeClass("active");
      jQuery(event.target).addClass("active");

    }
  },
  toUrl: function(){
    var values = [];
    var response_vals = [];
    response_vals.push($("li.response").hasClass("active") ? "1" : "0");
    values = $("#slide_filters ul.filters li.response div.filter-slider").slider("values");
    response_vals.push(values[0]);
    response_vals.push(values[1]);
    var biodiversity_vals = [];
    biodiversity_vals.push($("li.biodiversity").hasClass("active") ? "1" : "0");
    values = $("#slide_filters ul.filters li.biodiversity div.filter-slider").slider("values");
    biodiversity_vals.push(values[0]);
    biodiversity_vals.push(values[1]);
    var uncertainty_vals = [];
    uncertainty_vals.push($("li.uncertainty").hasClass("active") ? "1" : "0");
    values = $("#slide_filters ul.filters li.uncertainty div.filter-slider").slider("values");
    uncertainty_vals.push(values[0]);
    uncertainty_vals.push(values[1]);
    var size_vals = [];
    values = $("#slide_filters ul.filters li div.filter-slider.size").slider("values");
    size_vals.push(values[0]);
    size_vals.push(values[1]);
    return [response_vals.join(","), biodiversity_vals.join(","), uncertainty_vals.join(","), size_vals.join(",")];
  },
  fromUrl: function(resoDetails, bioDetails, uncertDetails, sizeDetails){
    var values = [];
    values = resoDetails.split(',');
    if(values[0] === "1"){
      $("li.response").addClass("active").trigger('click');
    } else {
      $("li.response").removeClass("active");
    }
    $("#slide_filters ul.filters li.response div.filter-slider").slider("values", values.slice(1)).trigger('slidestop', {values: values.slice(1)}).trigger('slidestop', {values: values.slice(1)});
    values = bioDetails.split(',');
    if(values[0] === "1"){
      $("li.biodiversity").addClass("active").trigger('click');
    } else {
      $("li.biodiversity").removeClass("active");
    }
    $("#slide_filters ul.filters li.biodiversity div.filter-slider").slider("values", values.slice(1)).trigger('slidestop', {values: values.slice(1)});
    values = uncertDetails.split(',');
    if(values[0] === "1"){
      $("li.uncertainty").addClass("active").trigger('click');
    } else {
      $("li.uncertainty").removeClass("active");
    }
    $("#slide_filters ul.filters li.uncertainty div.filter-slider").slider("values", values.slice(1)).trigger('slidestop', {values: values.slice(1)});
    values = sizeDetails.split(',');
    $("#slide_filters ul.filters li div.filter-slider.size").slider("values", values).trigger('slidestop', {values: values});
  }
});
