/*
 * Render the sites as a table
 */
App.views.ResultTable = Backbone.View.extend({
  el: 'table#results-table',

  initialize: function() {
    _.bindAll(this, 'render', 'addOne');

    this.species_ials = this.options.species_ials;
    this.species_ials.bind("all", this.render);
  },

  addAll: function() {
    this.species_ials.each(this.addOne);
  },

  addOne: function(species_ials) {
    var view = new App.views.ResultTableRow({model : species_ials});
    jQuery(this.el).find("tbody").append(view.render().el);
  },

  render: function() {
    jQuery(this.el).find("tbody").empty();
    this.addAll();
    return this;
  }
});

App.views.ResultTableRow = Backbone.View.extend({
  template: JST["site"],

  tagName: "tr",

  render: function() {
    jQuery(this.el).html(this.template(this.model.toJSON() ));
    return this;
  }
});
