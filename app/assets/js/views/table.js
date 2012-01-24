/*
 * Render the sites as a graph
 */
App.views.ResultTable = Backbone.View.extend({
  el: 'div#results-table',

  initialize: function() {
    _.bindAll(this, 'render');

    this.sites = this.options.sites;
    this.sites.bind("all", this.render);

  },

  addAll: function() {
    this.sites.each(this.addOne);
  },

  addOne: function(site) {
    var view = new App.views.ResultTableRow({model : site});
    jQuery("#results-table tbody").append(view.render().el);
  },

  render: function() {
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
