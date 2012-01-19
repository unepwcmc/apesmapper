/*
 * View the currently selected filters (apes and countries)
 */
App.views.SelectedFilters = Backbone.View.extend({
  el: jQuery('#selected_filters'),

  events: {
    'click #edit_filter': 'hide'
  },

  initialize: function() {
    _.bindAll(this, 'render');

    this.bus = this.options.bus;
    this.apes = this.options.apes;
    this.countries = this.options.countries;
    this.template = _.template( jQuery("#selected-filters-tmpl").html() );
    this.bus.on('save_filter:click', this.render);

    this.apes.bind("change", this.render);
    this.countries.bind("change", this.render);

    // TODO change bindings
  },

  render: function() {
    // selections contains only the selected elements
    var renderedContent, selections = {
      apes: _.map(this.apes.selected(), function(ape){
        return ape.toJSON();
      }),
      countries: _.map(this.countries.selected(), function(country){
        return country.toJSON();
      })
    }
    // render the template
    renderedContent = this.template(selections);
    jQuery(this.el).html(renderedContent);
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
  }
});
