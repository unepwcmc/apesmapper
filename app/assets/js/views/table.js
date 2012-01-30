/*
 * Render the sites as a table
 */
App.views.ResultTable = Backbone.View.extend({
  el: 'table#results-table',

  initialize: function() {
    _.bindAll(this, 'render', 'addOne');

    this.sites = this.options.sites;
    this.sites.bind("all", this.render);

    this.species_ials_table = this.options.species_ials_table;
    this.species_ials_table.bind("all", this.render);
  },

  addAll: function() {
    this.species_ials_table.each(this.addOne);
  },

  addOne: function(species_ials_table) {
    var view = new App.views.ResultTableRow({model : species_ials_table});
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
