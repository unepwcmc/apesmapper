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
            var stats_to_get = ['carbon', 
                    'carbon_countries',
                    'restoration_potential',
                    'forest_status',
                    'covered_by_KBA'];

            _.each(stats_to_get, function(stat) {
                app.bus.emit("loading_start");
                app.CartoDB[stat](polygons, function(data) {
                    if(data) {
                        stats[stat] = data;
                    } else {
                        app.bus.emit("loading_end");
                        app.Log.error("can't get stats from cartodb for ", stat);
                    }
                    count++;
                    if(1 || count == stats_to_get.length) {
                        app.bus.emit("loading_end");
                        callback(stats);
                    }
                });
             });
        },

        aggregate_stats: function(reports, polygons, callback) {
            function sum(reports, what) {
                var t = 0;
                _(reports).each(function(r) {
                    t += what(r);
                });
                return t;
            }
            // carbon
            var total_carbon = sum(reports, function(r) { 
                var s = r.get('stats');
                if(s && s.carbon && s.carbon.qty) {
                    return s.carbon.qty;
                }
                return 0;
            });

            var total_area = sum(reports, function(r) { 
                var s = r.get('stats');
                if(s && s.carbon && s.carbon.area) {
                    return s.carbon.area;
                }
                return 0;
            });

            var carbon_per_polygon = _(reports).map(function(r, i) {
                var percent = 0;
                var s = r.get('stats');
                if(total_carbon > 0 && s && s.carbon && s.carbon.qty) {
                    percent =  100*s.carbon.qty/total_carbon;
                }
                return {
                    polygon: 'AOI #' + i,
                    percent: percent
                };
            });

            callback({
                carbon_sum: {
                    qty: total_carbon,
                    polygons: carbon_per_polygon,
                    area: total_area
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
