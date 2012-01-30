/*
 * Render the species_ials as a graph
 */
App.views.Graph = Backbone.View.extend({
  el: 'div#graph',

  initialize: function() {
    _.bindAll(this, 'render', 'addOne');

    this.species_ials = this.options.species_ials;
    this.species_ials.bind("all", this.render);

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
    this.species_ials.each(this.addOne);
  },

  addOne: function(species_ial) {
    console.log(species_ial);
    var colors = ['#F5F5DC', '#0000FF', '#0095B6', '#8A2BE2', '#CD7F32', '#964B00', '#702963', '#960018', '#DE3163', '#007BA7', '#F7E7CE', '#7FFF00', '#6F4E37', '#B87333', '#F88379', '#DC143C', '#00FFFF', '#EDC9AF'];
    this.bubbleChart.addBubble(species_ial.get('state_score')*100, species_ial.get('pressure_score')*100, species_ial.get('area_km')*100, colors[Math.floor(Math.random()*colors.length)], "...");
  },

  render: function() {
    this.bubbleChart.empty();
    this.addAll();
    this.bubbleChart.redraw();

    return this;
  }
});
