
App.modules.Cartodb = function(app) {

var SQL_CARBON= "SELECT SUM(ST_Value(rast, 1, x, y)) AS total, \
ST_Area(ST_GeomFromText('<%= polygon %>', 4326)::geography) as area \
FROM carbonsequestration CROSS JOIN \
generate_series(1,10) As x CROSS JOIN generate_series(1,10) As y \
WHERE rid in ( SELECT rid FROM carbonsequestration WHERE ST_Intersects(rast, ST_GeomFromText('<%= polygon %>',4326)) ) \
AND \
ST_Intersects( \
  ST_Translate(ST_SetSRID(ST_Point(ST_UpperLeftX(rast), ST_UpperLeftY(rast)), 4326), ST_ScaleX(rast)*x, ST_ScaleY(rast)*y), \
  ST_GeomFromText('<%= polygon %>',4326) \
);";

var SQL_CARBON_COUNTRIES = "\
SELECT country, SUM(ST_Value(rast, 1, x, y)) AS total, \
ST_Area(ST_GeomFromText('<%= polygon %>', 4326)::geography) as area \
FROM carbonintersection CROSS JOIN \
generate_series(1,10) As x CROSS JOIN generate_series(1,10) As y CROSS JOIN countries \
WHERE rid IN ( SELECT rid FROM carbonintersection WHERE ST_Intersects(rast, ST_GeomFromText('<%= polygon %>',4326)) ) \
AND \
objectid IN ( SELECT objectid FROM countries WHERE ST_Intersects(the_geom, ST_GeomFromText('<%= polygon %>',4326)) ) \
AND \
ST_Intersects( \
  ST_Translate(ST_SetSRID(ST_Point(ST_UpperLeftX(rast) + (ST_ScaleX(rast)/2), ST_UpperLeftY(rast) + (ST_ScaleY(rast)/2)), 4326), ST_ScaleX(rast)*x, ST_ScaleY(rast)*y), \
  ST_GeomFromText('<%= polygon %>',4326) \
) \
AND \
ST_Intersects( \
  ST_Translate(ST_SetSRID(ST_Point(ST_UpperLeftX(rast) + (ST_ScaleX(rast)/2), ST_UpperLeftY(rast) + (ST_ScaleY(rast)/2)), 4326), ST_ScaleX(rast)*x, ST_ScaleY(rast)*y), \
  the_geom \
) \
GROUP BY country;";

var SQL_RESTORATION = " \
SELECT band, SUM(ST_Value(rast, band, x, y)) AS total \
FROM restorationpotencial CROSS JOIN \
generate_series(1,10) As x CROSS JOIN generate_series(1,10) As y CROSS JOIN generate_series(1,4) As band \
WHERE rid in ( SELECT rid FROM restorationpotencial WHERE ST_Intersects(rast, ST_GeomFromText('<%= polygon %>',4326)) ) \
AND \
ST_Intersects( \
  ST_Translate(ST_SetSRID(ST_Point(ST_UpperLeftX(rast), ST_UpperLeftY(rast)), 4326), ST_ScaleX(rast)*x, ST_ScaleY(rast)*y), \
  ST_GeomFromText('<%= polygon %>',4326) \
) \
GROUP BY band;"


var SQL_FOREST = " \
SELECT band, SUM(ST_Value(rast, band, x, y)) AS total \
FROM forestintactness CROSS JOIN \
generate_series(1,10) As x CROSS JOIN generate_series(1,10) As y CROSS JOIN generate_series(1,4) As band \
WHERE rid in ( SELECT rid FROM forestintactness WHERE ST_Intersects(rast, ST_GeomFromText('<%= polygon %>',4326)) ) \
AND \
ST_Intersects( \
  ST_Translate(ST_SetSRID(ST_Point(ST_UpperLeftX(rast), ST_UpperLeftY(rast)), 4326), ST_ScaleX(rast)*x, ST_ScaleY(rast)*y), \
  ST_GeomFromText('<%= polygon %>',4326) \
) \
GROUP BY band;"

var SQL_COVERED_KBA = "SELECT (overlapped_area / ( SELECT ST_Area(ST_GeomFromText('<%= polygon %>', 4326)) LIMIT 1 )) * 100 AS kba_percentage, count FROM ( SELECT COUNT(1), ST_Area( ST_Intersection( ST_Union(the_geom), ST_GeomFromText('<%= polygon %>',4326))) AS overlapped_area FROM kba WHERE ST_Intersects( ST_GeomFromText('<%= polygon %>',4326), the_geom) ) foo";


var SQL_COUNTRIES = " \
SELECT priority, country, ST_Area(ST_Intersection( \
 ST_Union(mg.the_geom)::geography, \
 ST_GeographyFromText('<%= polygon %>') \
))/1000 AS covered_area \
FROM gaps_merged mg \
WHERE ST_Intersects(mg.the_geom, \
 ST_GeometryFromText('<%= polygon %>', 4326) \
) \
GROUP BY priority, country";

    var resource_path= 'carbon-tool.cartodb.com/api/v1/sql';
    var resource_url = 'https://' + resource_path;

    function query(sql, callback, proxy) {
        var url = resource_url;
        var crossDomain = true;
        if(proxy) {
            url = 'api/v0/proxy/' + resource_url
            crossDomain = false;
        }
        if(sql.length > 1500) {
            $.ajax({
              url: url,
              crossDomain: crossDomain,
              type: 'POST',
              dataType: 'json',
              data: 'q=' + encodeURIComponent(sql),
              success: callback,
              error: function(){ 
                if(proxy) {
                    callback(); 
                } else {
                    //try fallback
                    app.Log.log("failed cross POST, using proxy");
                    query(sql, callback, true)
                }
              }
            });
        } else {
         //TODO: POST if the sql if too long
             $.getJSON(resource_url + '?q=' + encodeURIComponent(sql) + '&callback=?')
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
    app.CartoDB.wtk_polygon = wtk_polygon;
    app.CartoDB.test = function() {
        var p = [[[-1.4170918294416264,23.148193359375],[-1.6806671337507222,25.125732421875],[-3.743671274749718,24.290771484375]]];
        /*app.CartoDB.carbon(p, function(data) {
            console.log("carbon", data);
        });
        app.CartoDB.carbon_countries(p, function(data) {
            console.log('countries', data);
        });
        app.CartoDB.restoration_potential(p, function(data) {
            console.log("restoration", data);
        });
        app.CartoDB.forest_status(p, function(data) {
            console.log("forest", data);
        });*/
        var p2 =[[[-1.5,-77.7],[-1.5,-65.9],[3.1,-65.9],[3.1,-77.7],[-1.5,-77.7],[-1.5,-77.7]]];
        app.CartoDB.conservation_priorities(p2, 10000,  function(data) {
            console.log("conservation priorities", data);
        });

    };

    function stats_query(sql_query, polygon, callback) {
        var c = _.template(sql_query);
        var poly = wtk_polygon(polygon);
        var sql = c({polygon: poly});
        query(sql, callback);
        return sql;
    }

    app.CartoDB.carbon_sequestration = function(p, callback) {
        stats_query(SQL_CARBON, p, function(data) {
            if(data) {
                row = data.rows[0];
                callback({
                    qty: row.total || 0,
                    area: row.area
                });
            } else {
                callback();
            }
        });
    };

    app.CartoDB.carbon = function(p, callback) {
        stats_query(SQL_CARBON_COUNTRIES, p, function(data) {
            if(data) {
                //{"country":"Ghana","total":12578440024}
                var total = 0;
                var countries = _(data.rows).map(function(c) {
                    total += c.total;
                    return { name: c.country, qty: c.total };
                });
                callback({
                    qty: total,
                    area: data.rows[0].area,
                    countries: countries
                });
            } else {
                callback();
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
                  'remote': 0,
                  'none': 0
                };
                var total = 1.0;
                var percent = 100.0;
                _.each(data.rows, function(x) {
                    var p = 100*x.total/total;
                    percent -= p;
                    stats[value_map[x.band]] = p;
                });
                stats.none = percent;
                callback(stats);
            } else {
                callback();
            }
        });
    };

    app.CartoDB.covered_by_KBA = function(p, callback) {
        stats_query(SQL_COVERED_KBA, p, function(data) {
            if(data) {
                callback({
                    'percent': data.rows[0].kba_percentage || 0,
                    'num_overlap': data.rows[0].count|| 0
                });
            } else {
                callback();
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
                    if      (1 == v) return 'intact';
                    else if (2 == v) return 'deforested';
                    else if (3 == v) return 'partial';
                    return 'fragmented';
                }

                var total = 0;
                _.each(data.rows, function(x) {
                  total += x.total;
                });
                if(total > 0) {
                  _.each(data.rows, function(x) {
                      var k = get_type(x.band);
                      stats[k] = 100.0*x.total/total;
                  });
                }

                callback(stats);
            } else {
                callback();
            }
        });
    }

    app.CartoDB.covered_by_PA = function(p, callback) {
         // data from protected planet
         // but here to follow the same rule
         app.WS.ProtectedPlanet.PA_coverage(wtk_polygon(p), function(d) {
            if(d) {
              var num = 0;
              if(d.results && d.results.length >= 1) {
                  num = d.results[0].protected_areas.length;
              }
              callback({
                num_overlap: num,
                km2: d.sum_pa_cover_km2
              });
            } else {
              callback();
            }
         });
    };

    app.CartoDB.conservation_priorities = function(p, total_area, callback) {
        stats_query(SQL_COUNTRIES, p, function(data) {
            var countries = {};
            var priorities = {
                "Extremamente Alta": 0,
                "extrema": 0,
                "Muito Alta": 1,
                "Very High": 1,
                "Alta": 2,
                "alta": 2,
                "High": 2,
                "media": 3,
                "Medium": 3
                //"HUECO": 1
            };
            if(data) {
                _.each(data.rows, function(r) {
                    var priority = priorities[r.priority];
                    if(priority) {
                        countries[r.country] = countries[r.country] || new Array(0,0,0,0,0);
                        countries[r.country][priority] = 100*r.covered_area/total_area;
                    }
                });
                var stats = [];
                _.each(countries, function(percents, country) {
                    var total = percents[0] + percents[1] + percents[2] + percents[3];
                    percents[4] = 100 - total;
                    stats.push({ name: country, percents: percents});
                });
                callback(stats);
            } else {
                callback();
            }
        });
    };

};
