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


    /*
     ====================================================
     cartodb service
     ====================================================
    */

    WS.CartoDB = {
        calculate_stats: function(polygons, callback) {
            var stats = {};
            var count = 0;
            var stats_to_get = ['carbon', 'restoration_potential', 'forest_status'];
            _.each(stats_to_get, function(stat) {
                app.CartoDB[stat](polygons, function(data) {
                    if(data) {
                        stats[stat] = data;
                    } else {
                        app.Log.error("can't get stats from cartodb for ", stat);
                    }
                    count++;
                    if(count == stats_to_get.length) {
                        callback(stats);
                    }
                });
             });
        },

        aggregate_stats: function(polygons, callback) {
            callback({
                carbon_sum: {
                    qty: 10001,
                    polygons: [
                        { polygon: 'AOI #1', percent: 100 },
                        { polygon: 'AOI #2', percent: 20 },
                        { polygon: 'AOI #3', percent: 40 }
                    ]
                },
                coverage: {
                    PA: 51,
                    KBA: 90,
                    RestP: 65,
                    FStat: 12
                },
                conservation_priority_areas: [
                    { name: 'United States', percents: [50, 30, 20, 10, 40] },
                    { name: 'Spain', percents: [50, 30, 20, 10, 40] }
                ]
            });
        }
    };
}
