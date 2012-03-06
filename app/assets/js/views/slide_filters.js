/*
 * View the currently selected filters (species and countries)
 */
App.views.SlideFilters = Backbone.View.extend({
  el: '.range-form',

  events: {
    'slidestop .ui-slider': 'stop_slider',
    'click .content a.btn': 'select_filter'
  },

  initialize: function() {
    _.bindAll(this, 'render', 'stop_slider', 'update_area_slider');

    this.bus = this.options.bus;
    this.species = this.options.species;
    this.countries = this.options.countries;
    this.sites = this.options.sites;
    this.species_ials = this.options.species_ials;
    this.species_ials_min_max = this.options.species_ials_min_max;
    this.bus.on('save_filter:click', this.render);
    this.bus.on('update_area_slider', this.update_area_slider);

    // Sliders
    jQuery("div.ui-slider").slider({
      range: true,
      min: 0,
      max: 1,
      values: [0, 1],
      step: 0.01,
      slide: function(event, ui) {
        jQuery(event.target).find('.ui-slider-range').css('background-position', '-' + Math.round((ui.values[0]-ui.min)*1.5) + 'px 0px');
      }
    });
  },

  update_area_slider: function(){
    var minArea = this.species_ials_min_max.getCurrentMin();
    var maxArea = this.species_ials_min_max.getCurrentMax();
    $('#area_slider').slider('option', 'min', minArea);
    $('#area_slider').slider('option', 'max', maxArea);
    $(".range-form .size .min-value").val(minArea);
    $(".range-form .size .max-value").val(maxArea);
  },

  enable_select: function() {
    // Enables saving the filter changes
    jQuery('#save_filter span.button_info').text('Filter');
    jQuery('#save_filter').removeAttr('disabled');
  },
  
  stop_slider: function(event, ui) {
    if(jQuery(event.target).parents('.range').hasClass("response")) {
      this.species_ials.filterByResponse(ui.values[0], ui.values[1]);

      $(".range-form .response .min-value").val(ui.values[0]);
      $(".range-form .response .max-value").val(ui.values[1]);
    } else if(jQuery(event.target).parents('.range').hasClass("biodiversity")) {
      this.species_ials.filterByBiodiversity(ui.values[0], ui.values[1]);

      $(".range-form .biodiversity .min-value").val(ui.values[0]);
      $(".range-form .biodiversity .max-value").val(ui.values[1]);
    } else if(jQuery(event.target).parents('.range').hasClass("size")) {
      this.species_ials.filterBySize(ui.values[0], ui.values[1]);

      $(".range-form .size .min-value").val(ui.values[0]);
      $(".range-form .size .max-value").val(ui.values[1]);
    }
  },

  select_filter: function(event) {
    if(jQuery(event.target).next().hasClass("response")) {

      this.species_ials.selectFilter("response");
      jQuery(event.target).siblings('li').removeClass("active");
      jQuery(event.target).addClass("active");

    } else if(jQuery(event.target).next().hasClass("biodiversity")) {

      this.species_ials.selectFilter("biodiversity");
      jQuery(event.target).siblings('li').removeClass("active");
      jQuery(event.target).addClass("active");

    }
    // Update active button classes
    $(this.el).find('.content .btn').removeClass('active');
    jQuery(event.target).addClass('active');
  },
  toUrl: function(){
    var values = [];
    var response_vals = [];
    response_vals.push($(".response").hasClass("active") ? "1" : "0");
    values = $(".range-form .response .ui-slider").slider("values");
    response_vals.push(values[0]);
    response_vals.push(values[1]);
    var biodiversity_vals = [];
    biodiversity_vals.push($(".biodiversity").hasClass("active") ? "1" : "0");
    values = $(".range-form .biodiversity .ui-slider").slider("values");
    biodiversity_vals.push(values[0]);
    biodiversity_vals.push(values[1]);
    var size_vals = [];
    values = $(".range-form .size .ui-slider").slider("values");
    size_vals.push(values[0]);
    size_vals.push(values[1]);
    return [response_vals.join(","), biodiversity_vals.join(","), size_vals.join(",")];
  },
  fromUrl: function(resoDetails, bioDetails, sizeDetails){
    var values = [];
    values = resoDetails.split(',');
    if(values[0] === "1"){
      $("li.response").addClass("active").trigger('click');
    } else {
      $("li.response").removeClass("active");
    }
    $(".range-form .response .ui-slider").slider("values", values.slice(1)).trigger('slidestop', {values: values.slice(1)});
    $(".range-form .response .min-value").html(values[1]);
    $(".range-form .response .max-value").html(values[2]);
    values = bioDetails.split(',');
    if(values[0] === "1"){
      $("li.biodiversity").addClass("active").trigger('click');
    } else {
      $("li.biodiversity").removeClass("active");
    }
    $(".range-form .biodiversity .ui-slider").slider("values", values.slice(1)).trigger('slidestop', {values: values.slice(1)});
    $(".range-form .biodiversity .min-value").html(values[1]);
    $(".range-form .biodiversity .max-value").html(values[2]);
    values = sizeDetails.split(',');
    $(".range-form .size .ui-slider").slider("values", values).trigger('slidestop', {values: values});
    $(".range-form .size .min-value").html(values[0]);
    $(".range-form .size .max-value").html(values[1]);
  }
});
