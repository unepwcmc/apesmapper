/*
 * Render the sites as a graph
 */
App.views.Graph = Backbone.View.extend({
  el: 'div#graph',

  initialize: function() {
    _.bindAll(this, 'render', 'addOne');

    this.sites = this.options.sites;
    this.sites.bind("all", this.render);

    // Create the graph
    this.bubbleChart = new Chart.Bubble('graph', {
      width: 659,
      height: 580,
      lineColor: '#3f3f3f',
      zmin: 0, zmax: 100,
      bubbleSize: 40
    });
  },

  addAll: function() {
    this.sites.each(this.addOne);
  },

  addOne: function(site) {
    var colors = ['#F5F5DC', '#0000FF', '#0095B6', '#8A2BE2', '#CD7F32', '#964B00', '#702963', '#960018', '#DE3163', '#007BA7', '#F7E7CE', '#7FFF00', '#6F4E37', '#B87333', '#F88379', '#DC143C', '#00FFFF', '#EDC9AF'];
    this.bubbleChart.addBubble(site.get('state')*100, site.get('pressure')*100, site.get('area'), colors[Math.floor(Math.random()*colors.length)], site.get('name'));
  },

  render: function() {
    this.bubbleChart.empty();

    this.addAll();

    this.bubbleChart.redraw();

    return this;
  }
});
