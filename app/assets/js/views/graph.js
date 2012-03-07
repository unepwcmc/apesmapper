/*
 * Render the species_ials as a graph
 */
App.views.Graph = Backbone.View.extend({
  el: 'div#graph',

  initialize: function() {
    _.bindAll(this, 'render', 'addOne', 'color', 'createGraph');

    this.species_ials = this.options.species_ials;
    this.species_ials_min_max = this.options.species_ials_min_max;
    this.species_ials.bind("all", this.render);

    // We need to know the max area to scale the graph sizes correctly
    $.getJSON('http://carbon-tool.cartodb.com/api/v1/sql?q=SELECT MAX(area_km2) AS max_area_km2 FROM species_ials', this.createGraph);
  },
  createGraph: function(data) {
    // Create the graph
    this.bubbleSize = 60;
    this.max_area_km2 = data.rows[0].max_area_km2;
    this.bubbleChart = new Chart.Bubble('graph', {
      width: 651,
      height: 538,
      lineColor: 'rgba(0,0,0,0)',
      zmin: 0, zmax: 100,
      bubbleSize: this.bubbleSize
    });
    $('#graph canvas').css('background', "url('/img/graph.jpg') no-repeat 13px 51px");
    this.render();
  },
  addAll: function() {
    this.species_ials.each(this.addOne);
  },

  addOne: function(species_ial) {
    var color = 'rgb(0,0,0)', tooltip = '';
    var maxResponseColor = {
      red:117,
      green:4,
      blue:12
    };
    var minResponseColor = {
      red:248,
      green:240,
      blue:145
    };
    var maxBiodiversityColor = {
      red:41,
      green:40,
      blue:164
    };
    var minBiodiversityColor = {
      red:94,
      green:174,
      blue:100
    };

    if(this.species_ials.filter_selected === "response") {
      this_score = (1-0)/(this.species_ials_min_max.maxResponse-this.species_ials_min_max.minResponse)*species_ial.get('response_score')+0;
      color = this.color(maxResponseColor, minResponseColor, this_score);
      tooltip = 'IAS: ' + species_ial.get('ial_id') + '-' + species_ial.get('name') + '<br/>';
      tooltip = tooltip + 'Response: ' + species_ial.get('response_score') + '<br/>';
      tooltip = tooltip + 'Biodiversity: ' + species_ial.get('biodiversity_score') + '<br/>';
    } else if(this.species_ials.filter_selected === "biodiversity") {
      this_score = (1-0)/(this.species_ials_min_max.maxBiodiversity-this.species_ials_min_max.minBiodiversity)*species_ial.get('biodiversity_score')+0;
      color = this.color(maxBiodiversityColor, minBiodiversityColor, this_score);
      tooltip = 'IAS: ' + species_ial.get('ial_id') + '-' + species_ial.get('name') + '<br/>';
      tooltip = tooltip + 'Response: ' + species_ial.get('response_score') + '<br/>';
      tooltip = tooltip + 'Biodiversity: ' + species_ial.get('biodiversity_score') + '<br/>';
    }

    this.bubbleChart.addBubble(species_ial.get('habitat_score')*100, species_ial.get('pressure_score')*100, species_ial.get('area_km2')/this.max_area_km2*this.bubbleSize, color, tooltip);
  },

  render: function() {
    if(typeof(this.bubbleChart) !== 'undefined') {
      this.bubbleChart.empty();
      this.addAll();
      this.bubbleChart.redraw();
    }

    return this;
  },
  
  // Calculates a color gradient from the origin color to black based on a number
  color: function(maxValues, minValues, gradient) {
    var color = 'rgb(';

    var redRange = maxValues.red - minValues.red;
    var redValue = Math.round(redRange*gradient) + minValues.red;
    color = color + redValue + ',';

    var greenRange = maxValues.green - minValues.green;
    var greenValue = Math.round(greenRange*gradient) + minValues.green;
    color = color + greenValue + ',';

    var blueRange = maxValues.blue - minValues.blue;
    var blueValue = Math.round(blueRange*gradient) + minValues.blue;
    color = color + blueValue ;

    color = color + ')';
    return color;
  }
});
