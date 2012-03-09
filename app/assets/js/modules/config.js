

// application config
App.modules.Config = function(app) {

    app.config = {
        API_URL: '/api/v0/work',
        LOCAL_STORAGE: false,
        MAX_POLYGON_AREA: 8000000*1000*1000,// #8.000.000km^2
        MAP_LAYERS: [{
            name: 'Taxa Extent of Occurrence: Africa',
            opacity: 1.0,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/eoos_africa/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'Taxa Extent of Occurrence: Asia',
            opacity: 1.0,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/eoo_asia/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'Deforestation (%)',
            opacity: 1.0,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/deforestation/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'Human Influence Index',
            opacity: 1.0,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/human_influence_index/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'Population Change (%)',
            opacity: 1.0,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/population_change/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'Population Count',
            opacity: 1.0,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/population_count/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'Forest Cover (%)',
            opacity: 1.0,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/forest_cover/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'Carbon Stocks (tonnes/ha)',
            opacity: 1.0,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/carbon_stock/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'Species Richness',
            opacity: 1.0,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/spp_richness/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }
        ]
    };

}
/**, {
            name: 'carbon sequestration',
            opacity: 0.7,
            url: 'http://lifeweb-maps.unep-wcmc.org/ArcGIS/rest/services/lifeweb/carb_seq/MapServer/tile/{Z}/{Y}/{X}',
             enabled: false
          }, {
            name: 'restoration potential',
            opacity: 0.7,
            url: 'http://lifeweb-maps.unep-wcmc.org/ArcGIS/rest/services/lifeweb/rest_pot/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'forest status',
            url: 'http://lifeweb-maps.unep-wcmc.org/ArcGIS/rest/services/lifeweb/forest_intact/MapServer/tile/{Z}/{Y}/{X}',
            opacity: 0.7,
            enabled: false
          }, {
            name: 'KBA',
            url: 'http://carbon-tool.cartodb.com/tiles/kba/{Z}/{X}/{Y}.png',
            opacity: 0.7,
            enabled: false
          }, {
              name: 'Gap Analysis',
              url: 'http://carbon-tool.cartodb.com/tiles/gap_analysis/{Z}/{X}/{Y}.png',
              opacity: 0.7,
              enabled: false
          }
*/
