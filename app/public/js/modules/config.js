

// application config
App.modules.Config = function(app) {

    app.config = {
        API_URL: '/api/v0/work',
        LOCAL_STORAGE: false,
        MAP_LAYERS: [{
             name: 'protected',
             url: 'http://184.73.201.235/blue/{Z}/{X}/{Y}',
             opacity: 0.4
          }, {
             name: 'carbon',
             opacity: 0.4,
             url: 'http://downloads.wdpa.org/ArcGIS/rest/services/carbon/Carbon_webmerc_93/MapServer/tile/{Z}/{Y}/{X}'
          }, {
            name: 'carbon sequestration',
            opacity: 0.4,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/lifeweb/carbonseq/MapServer/tile/{Z}/{Y}/{X}'
          }, {
            name: 'carbon 2',
            opacity: 0.4,
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/lifeweb/carbon/MapServer/tile/{Z}/{Y}/{X}'
          }, {
            name: 'forest',
            url: 'http://ec2-46-137-148-168.eu-west-1.compute.amazonaws.com/ArcGIS/rest/services/lifeweb/forest_intact/MapServer/tile/{Z}/{Y}/{X}',
            opacity: 0.4
          }

        ]
    };

}
