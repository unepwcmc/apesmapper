
/*
 ===============================================
 control map related things
 ===============================================
*/
App.modules.Map = function(app) {

    app.Map = Class.extend({
        init: function(options) {
            _.bindAll(this, 'enable_layer', 'reoder_layers', 'reorder_layers', 'remove_all', 'clear');
            var self = this;
            this.map = new App.views.MapView({el: jQuery('.map_container'), species_ials: options['species_ials']});
            this.seachbox = new Searchbox({el: jQuery('.map_container .search')});

            // add layers to the map
            _(app.config.MAP_LAYERS).each(function(layer) {
                self.map.add_layer(layer.name, layer);
                self.map.enable_layer(layer.name, layer.enabled);
            });

            this.bus = options['bus'];
            this.layer_editor = new LayerEditor({
                el: jQuery('.layers'),
                bus: this.bus,
                layers: this.map.get_layers()
            });

            this.bus.link(this, {
                'map:enable_layer': 'enable_layer',
                'map:reorder_layers':'reorder_layers'
            });

            this.movement_timeout = -1;

            this.seachbox.bind('goto', function(latlng, bounds) {
                self.map.set_center(latlng);
                self.map.map.fitBounds(bounds);
            });
            this.show_controls(true);

        },

        work_mode: function() {
            jQuery('.map_container').css({right: '352px'});
        },

        enable_layer: function(name, enable) {
            this.map.enable_layer(name, enable);
        },

        reoder_layers: function(new_order) {
            this.map.reoder_layers(new_order);
            this.layer_editor.render();
        },

        clear: function() {
          this.report_polygons = {};
          this.remove_all();
        },

        remove_all: function() {
            var self = this;
            // clean
            _(self.polygons).each(function(p) {
                p.remove();
            });

            self.polygons = [];
        },

        reorder_layers: function(order) {
            this.map.reorder_layers(order);
            this.layer_editor.render();
        },

        show_controls: function(show) {
            if(show) {
                this.map.show_controls();
                jQuery('.layers').show();
                jQuery('.search').show();
            } else {
                this.map.hide_controls();
                jQuery('.layers').hide();
                jQuery('.search').hide();
            }
        }
    });
};
