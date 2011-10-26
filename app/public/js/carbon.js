/*
 ===============================================
 main enter point
 ===============================================
*/

App.modules.Carbon = function(app) {

   // app router
   var Router = Backbone.Router.extend({
      routes: {
        "w/:work":        "work",  // #work
        "w/:work/:state": "work"   // #work/state
      },

      work: function() { 
        app.Log.log("route: work");
      }

    });

    // the app
    app.Carbon = Class.extend({

        init: function() {
            _.bindAll(this, 'on_route');
            // set a common syntax for templates
            _.templatesettings = {
                interpolate : /\{\{(.+?)\}\}/g
            };
        },

        run: function() {
            this.bus = new app.Bus();
            this.map = new app.Map(this.bus);
            this.work = new app.Work(this.bus);
            this.panel = new app.Panel(this.bus);

            // init routing
            this.router = new Router();
            this.router.bind('route:work', this.on_route);

            // ready, luanch
            Backbone.history.start();
            //this.router.navigate('w/work_test');
        },

        on_route: function(work_id) {
            this.bus.emit('work', work_id);
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
        init: function(bus) {
            this.map = new MapView({el: $('.map_container')});
            this.polygon_edit = new PolygonDrawEditTool({mapview: this.map});
            this.polygon_edit.editing_state(true);

            //bindings
            bus.attach(this.polygon_edit, 'polygon');
        }
    });
};
