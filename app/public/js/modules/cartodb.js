
App.modules.Cartodb = function(app) {

var SQL_CARBON = "SELECT ST_Area(ST_GeomFromText('<%= polygon %>', 4326)::geography) as area, intersects_sum, within_sum FROM (SELECT SUM((pvc).value * (pvc).count) AS intersects_sum FROM (SELECT ST_ValueCount(ST_AsRaster((intersection).geom, 0.0089285714, -0.0089285714, NULL, NULL, ARRAY['32BSI'], ARRAY[(intersection).val])) AS pvc FROM (SELECT (ST_Intersection(rast, the_geom)) AS intersection FROM carbon, (SELECT ST_GeomFromText('<%= polygon %>',4326) AS the_geom) foo WHERE ST_Intersects(rast, the_geom) AND ST_Within(rast, the_geom) = false) bar) AS foo WHERE (pvc).value > 0 and (pvc).value != 2147483647) intersects,(SELECT SUM((ST_SummaryStats(rast)).sum) AS within_sum FROM carbon, (SELECT ST_GeomFromText('<%= polygon %>',4326) AS the_geom) foo WHERE ST_Within(rast, the_geom)) within;";

var SQL_RESTORATION = "SELECT total_n_pixels, (pvc).value, SUM((pvc).count) FROM (SELECT ST_ValueCount(ST_AsRaster((intersection).geom, scalex, scaley, NULL, NULL, ARRAY['32BSI'], ARRAY[(intersection).val])) AS pvc, CAST((area / (scalex * scalex)) AS Integer) AS total_n_pixels FROM (SELECT (ST_Intersection(rast, the_geom)) AS intersection, ST_ScaleX(rast) AS scalex, ST_ScaleY(rast) AS scaley, ST_Area(the_geom) AS area FROM restoration_potential, (SELECT ST_GeomFromText('<%= polygon %>',4326) AS the_geom) foo WHERE ST_Intersects(rast, the_geom)) bar) AS foo GROUP BY total_n_pixels, value;";

var SQL_FOREST = "SELECT total_n_pixels, (pvc).value, SUM((pvc).count) FROM (SELECT ST_ValueCount(ST_AsRaster((intersection).geom, scalex, scaley, NULL, NULL, ARRAY['32BSI'], ARRAY[(intersection).val])) AS pvc, CAST((area / (scalex * scalex)) AS Integer) AS total_n_pixels FROM (SELECT (ST_Intersection(rast, the_geom)) AS intersection, ST_ScaleX(rast) AS scalex, ST_ScaleY(rast) AS scaley, ST_Area(the_geom) AS area FROM carbon_forest_intact, (SELECT ST_GeomFromText('<%= polygon %>',4326) AS the_geom) foo WHERE ST_Intersects(rast, the_geom)) bar) AS foo GROUP BY total_n_pixels, value;";

var SQL_COVERED_KBA = "SELECT (SELECT (SELECT ST_Area(ST_Intersection(ST_Union(the_geom),ST_GeomFromText('<%= polygon %>',4326))) as overlapped_area FROM kba WHERE ST_Intersects(ST_GeomFromText('<%= polygon %>',4326), the_geom)) / (SELECT ST_Area(ST_GeomFromText('<%= polygon %>', 4326)) FROM kba LIMIT 1 ) as result) * 100 as kba_percentage;"

var SQL_COUNTRIES = "SELECT priority, country, ST_Area(ST_Intersection( ST_Union(mg.the_geom)::geography, ST_GeographyFromText('<%= polygon %>')))/1000 AS covered_area FROM gaps_merged mg WHERE ST_Intersects(mg.the_geom, ST_GeometryFromText('<%= polygon %>', 4326)) GROUP BY priority, country";



    var resource_url = 'https://carbon-tool.cartodb.com/api/v1/sql';

    function query(sql, callback) {
        if(sql.length > 1500) {
            $.ajax({
              url: resource_url,
              type: 'POST',
              dataType: 'json',
              data: 'q=' + encodeURI(sql),
              success: callback,
              error: function(){ callback(); }
            });
        } else {
         //TODO: POST if the sql if too long
             $.getJSON(resource_url + '?q=' + encodeURI(sql) + '&callback=?')
             .success(callback)
             .error(function(){ callback(); });
        }
    }

    function wtk_polygon(poly) {
        var multipoly = [];
        _.each(poly, function(p) {
            var closed = p.concat([p[0]]);
            var wtk = _.map(closed, function(point) {
                return point[1] + " " + point[0];
            }).join(',');
            multipoly.push("((" + wtk + "))");
        });
        return 'MULTIPOLYGON(' + multipoly.join(',') + ')';
    }

    app.CartoDB = {};
    app.CartoDB.test = function() {
        var p = [[[-1.4170918294416264,23.148193359375],[-1.6806671337507222,25.125732421875],[-3.743671274749718,24.290771484375]]];
        app.CartoDB.carbon(p, function(data) {
            console.log(data);
        });
        /*app.CartoDB.restoration_potential(p, function(data) {
            console.log(data);
        });
        app.CartoDB.forest(p, function(data) {
            console.log(data);
        });
        */
    };

    function stats_query(sql_query, polygon, callback) {
        var c = _.template(sql_query);
        var poly = wtk_polygon(polygon);
        var sql = c({polygon: poly});
        query(sql, callback);
    }

    app.CartoDB.carbon = function(p, callback) {
        stats_query(SQL_CARBON, p, function(data) {
            if(data) {
                row = data.rows[0];
                callback({
                    qty: row.intersects_sum + (row.within_sum || 0),
                    area: row.area
                });
            }
        });
    };

    app.CartoDB.restoration_potential = function(p, callback) {
        stats_query(SQL_RESTORATION, p, function(data) {
            if(data) {
                var value_map = {'1': 'wide_scale', '2': 'mosaic', '3': 'remote', '4':'agricultural lands'};
                var stats = {
                  'wide_scale': 0,
                  'mosaic': 0,
                  'remove': 0,
                  'none': 0
                };
                var total = 0.0;
                var total_n_pixels = 1.0;
                _.each(data.rows, function(x) {
                    stats[value_map[x.value]] = 100.0*x.sum/x.total_n_pixels;
                    total += x.sum;
                    total_n_pixels = x.total_n_pixels;
                });
                stats.none = 100.0 * (1.0 - total/total_n_pixels);
                callback(stats);
            }
        });
    };

    app.CartoDB.covered_by_KBA = function(p, callback) {
        stats_query(SQL_COVERED_KBA, p, function(data) {
            if(data) {
                callback({
                    'percent': data.rows[0].kba_percentage || 0,
                    'num_overlap': 'todo'
                });

            }
        });
    }

    app.CartoDB.forest_status = function(p, callback) {
        stats_query(SQL_FOREST, p, function(data) {
            if(data) {
                var stats = {
                    'intact': 0,
                    'fragmented': 0,
                    'partial': 0,
                    'deforested': 0 
                };

                function get_type(v) {
                    if      (0 <= v && v <= 3) return 'intact';
                    else if (4 <= v && v <= 6) return 'deforested';
                    else if (7 <= v && v <= 9) return 'partial';
                    return 'fragmented';
                }

                var total = 0.0;
                var total_n_pixels = 1.0;
                _.each(data.rows, function(x) {
                    var k = get_type(x.value);
                    stats[k] = 100.0*x.sum/x.total_n_pixels;
                });
                callback(stats);
            }
        });
    }

};
