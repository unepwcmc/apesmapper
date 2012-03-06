

// application config
App.modules.Config = function(app) {

    app.config = {
        API_URL: '/api/v0/work',
        LOCAL_STORAGE: false,
        MAX_POLYGON_AREA: 8000000*1000*1000,// #8.000.000km^2
        MAP_LAYERS: [{
            name: 'carbon stock',
            opacity: 0.7,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/carbon_stock/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'deforestation',
            opacity: 0.7,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/deforestation/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'eoo asia',
            opacity: 0.7,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/eoo_asia/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'eoos africa',
            opacity: 0.7,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/eoos_africa/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'forest_cover',
            opacity: 0.7,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/forest_cover/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'human influence index',
            opacity: 0.7,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/human_influence_index/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'population change',
            opacity: 0.7,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/population_change/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'population count',
            opacity: 0.7,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/apesmapper/population_count/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'spp richness',
            opacity: 0.7,
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
