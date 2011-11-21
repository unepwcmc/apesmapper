

// application config
App.modules.Config = function(app) {

    app.config = {
        API_URL: '/api/v0/work',
        LOCAL_STORAGE: false,
        MAX_POLYGON_AREA: 10000*1000,
        MAP_LAYERS: [{
             name: 'protected areas',
             url: 'http://184.73.201.235/blue/{Z}/{X}/{Y}',
             opacity: 0.4,
             enabled: true
          }, {
             name: 'carbon',
             opacity: 0.4,
             url: 'http://lifeweb-maps.unep-wcmc.org/ArcGIS/rest/services/lifeweb/carbon/MapServer/tile/{Z}/{Y}/{X}',
             enabled: true 
          }, {
            name: 'carbon sequestration',
            opacity: 0.4,
            url: 'http://lifeweb-maps.unep-wcmc.org/ArcGIS/rest/services/lifeweb/carb_seq/MapServer/tile/{Z}/{Y}/{X}',
             enabled: false
          }, {
            name: 'restoration potential',
            opacity: 0.4,
            url: 'http://lifeweb-maps.unep-wcmc.org/ArcGIS/rest/services/lifeweb/rest_pot/MapServer/tile/{Z}/{Y}/{X}',
            enabled: false
          }, {
            name: 'forest status',
            url: 'http://lifeweb-maps.unep-wcmc.org/ArcGIS/rest/services/lifeweb/forest_intact/MapServer/tile/{Z}/{Y}/{X}',
            opacity: 0.4,
            enabled: false
          }, {
            name: 'KBA',
            url: 'https://carbon-tool.cartodb.com/tiles/kba/{Z}/{X}/{Y}.png',
            opacity: 0.4,
            enabled: false
          }

        ]
    };

}
