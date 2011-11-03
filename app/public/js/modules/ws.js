
function get_fake_data() {
    function rnd(max) {
        return (max*Math.random()).toFixed(0);
    }
    return {
      carbon: {
        qty: (1234567*Math.random()).toFixed(0),
        by_country: [
          {name: 'Mexico', qty: rnd(9999)},
          {name: 'Spain', qty: rnd(9999)}
        ]
      },
      'restoration_potential': {
          wide_scale: rnd(100),
          mosaic: rnd(100),
          remove: rnd(100),
          none: rnd(100)
      },
      'covered_by_PA':  {
        percent: rnd(100),
        num_overlap: rnd(20)
      },
      'covered_by_KBA':  {
        percent: rnd(100),
        num_overlap: rnd(20)
      },
      'forest_status': {
        intact: rnd(100),
        fragmented: rnd(100),
        partial: rnd(100),
        deforested: rnd(100)
      }
    };
}

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
            setTimeout(function() {
                callback(get_fake_data());
            }, 1000);
        }
    };
}
