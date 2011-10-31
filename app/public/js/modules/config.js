

// application config
App.modules.Config = function(app) {

    app.config = {
        API_URL: '/api/v0/work',
        LOCAL_STORAGE: false,
        MAP_LAYERS: [{
             name: 'carbon',
             url: 'http://downloads.wdpa.org/ArcGIS/rest/services/carbon/Carbon_webmerc_93/MapServer/tile/{Z}/{Y}/{X}'
          },{
             name: 'protected',
              url: 'http://184.73.201.235/blue/{Z}/{X}/{Y}'
          }
        ]
    };

}
