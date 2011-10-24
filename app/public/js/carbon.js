/*
 ===============================================
 main enter point
 ===============================================
*/

App.modules.Carbon = function(app) {

    app.Carbon = Class.extend({

        init: function() {
        },

        run: function() {
            this.bus = new app.Bus();
            this.map = new app.Map(this.bus);
        }

    });
};


/*
 ===============================================
 control map related things
 ===============================================
*/
App.modules.Map = function(app) {
    app.Map = Class.extend({
        init: function() {
            this.map = new MapView({el: $('.map_container')});
            this.polygon_edit = new PolygonDrawEditTool({mapview: this.map});
            this.polygon_edit.editing_state(true);
        }
    });
};
