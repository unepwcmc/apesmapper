
/*
 ===============================================
 external ws
 ===============================================
*/
App.modules.WS = function(app) {

    var WS = app.WS = {};

    WS.ProtectedPlanet = {
        URL: 'http://protectedplanet.net/',
        /**
         * call callbacl with the info a [lat, lon]
         * is called with null if thereis no info
         */
        info_at: function(latLng, callback) {
            $.getJSON(this.URL + 'api/sites_by_point/' + latLng[1] + '/' + latLng[0] + '?callback=?')
            .success(function(data) {
                if(data && data.length) {
                    callback(data[0]);
                } else {
                    callback(null);
                }
             })
            .error(function() { callback(null); });
        },

        PA_polygon: function(pa_id, callback) {
            $.getJSON(this.URL + 'api2/sites/' + pa_id + '/geom' + '?callback=?')
            .success(function(data) {
                if(data) {
                    callback(data);
                } else {
                    callback(null);
                }
             })
            .error(function() { callback(null); });
        }
    };
}
