
/*
 ===============================================
 control map related things
 ===============================================
*/
App.modules.Map = function(app) {

    // edit, delete popup shown when user is editing a poly
    var Popup = Backbone.View.extend({
        el: $('#polygon_popup'),

        events: {
            'click #delete': 'remove',
            'click #done': 'edit'
        },

        initialize: function() {
            _.bindAll(this, 'show', 'hide', 'remove', 'edit');
            this.map = this.options.mapview;
            this.smooth = this.options.smooth || true;
            this.smooth_k = 0.08;
            this.target_pos = null;
            this.current_pos = null;
        },

        remove: function(e) {
            e.preventDefault();
            this.trigger('remove');
        },

        edit: function(e) {
            e.preventDefault();
            this.trigger('edit');
        },

        show: function(at) {
            var self = this;
            var px = this.map.projector.transformCoordinates(at);
            if(!this.timer) {
                this.timer = setInterval(function() {
                    self.current_pos.x += (self.target_pos.x - self.current_pos.x)*self.smooth_k;
                    self.current_pos.y += (self.target_pos.y - self.current_pos.y)*self.smooth_k;
                    self.set_pos(self.current_pos);
                }, 20);
                this.current_pos = px;
            }
            this.target_pos = px;

            if(!this.smooth) {
                set_pos(px);
            }
        },

        set_pos: function(p) {
            this.el.css({
                top: this.current_pos.y - 20 - 50,
                left: this.current_pos.x
            });
            this.el.show();
        },

        hide: function() {
            this.el.hide();
            if(this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }
    });

    //TODO: refactor base popup
    var ProtectedZonePopup = Backbone.View.extend({
        el: $('#protected_popup'),

        events: {
            'click .close': 'hide',
            'click #add_protected': 'add_protected_area'
        },

        initialize: function() {
            _.bindAll(this, 'show', 'hide');
            this.map = this.options.mapview;
            this.name_el = this.$('.name');
            this.protected_zone = null;
        },

        show: function(at, protected_zone_info) {
            var self = this;
            self.name_el.html(protected_zone_info.name);
            this.protected_zone = protected_zone_info;
            var px = this.map.projector.transformCoordinates(at);
            self.set_pos(px);
        },

        set_pos: function(p) {
            this.el.css({
                top: p.y - 120,
                left: p.x - 30
            });
            this.el.show();
        },

        hide: function(e) {
            if(e) { e.preventDefault(); }
            this.el.hide();
        },

        add_protected_area: function(e) {
            var self = this;
            if(e) { e.preventDefault(); }
            self.hide();
            app.WS.ProtectedPlanet.PA_polygon(this.protected_zone.id, function(geom) {
                // convert polygon lon, lat -> lat, lon
                var polygons = geom.the_geom.coordinates;
                if(geom.the_geom.type === "MultiPolygon") {
                } else {
                    polygons = [polygons];
                }
                _(polygons).each(function(coord) {
                    var polygon = _(coord).map(function(poly) {
                        return _(poly).map(function(latlon) {
                            return [latlon[1], latlon[0]];
                        });
                    });
                    self.trigger('add_polygon', polygon);
                });
            });
        }

    });


    app.Map = Class.extend({
        init: function(bus) {
            _.bindAll(this, 'show_report', 'start_edit_polygon', 'end_edit_polygon', 'remove_polygon', 'disable_editing', 'enable_editing', 'enable_layer', 'reoder_layers', 'protected_area_click','reorder_layers', 'update_report');
            var self = this;
            this.map = new MapView({el: $('.map_container')});
            // add layers to the map
            _(app.config.MAP_LAYERS).each(function(layer) {
                self.map.add_layer(layer.name, layer);
                self.map.enable_layer(layer.name, layer.enabled);
            });

            this.popup = new Popup({mapview: this.map});
            this.protectedzone_popup = new ProtectedZonePopup({mapview: this.map});
            this.layer_editor = new LayerEditor({
                el: $('.layers'),
                bus: bus,
                layers: this.map.get_layers()
            });
            this.polygon_edit = new PolygonDrawTool({mapview: this.map});
            this.editing(false);
            this.polygons = [];
            this.bus = bus;

            this.movement_timeout = -1;

            bus.link(this, {
                'view:show_report': 'show_report',
                'view:update_report': 'update_report',
                'polygon': 'disable_editing',
                'map:edit_mode': 'enable_editing',
                'map:no_edit_mode': 'disable_editing',
                'map:enable_layer': 'enable_layer',
                'map:reorder_layers':'reorder_layers'
            });

            //bindings
            bus.attach(this.polygon_edit, 'polygon');
            this.popup.bind('edit', this.end_edit_polygon);
            this.popup.bind('remove', this.remove_polygon);

            this.protectedzone_popup.bind('add_polygon', function(polygon) {
                self.bus.emit('polygon', {paths: polygon});
            });
            this.show_controls(false);


        },

        enable_layer: function(name, enable) {
            this.map.enable_layer(name, enable);
        },

        reoder_layers: function(new_order) {
            this.map.reoder_layers(new_order);
        },

        editing: function(b) {
            this.polygon_edit.editing_state(b);
            // always try to unbind to avoid bind twice
            this.map.unbind('click', this.protected_area_click);
            if(!b) {
                this.map.bind('click', this.protected_area_click);
            }
        },

        protected_area_click: function(e) {
            var self = this;
            var pos = [e.latLng.lat(), e.latLng.lng()];
            app.WS.ProtectedPlanet.info_at(pos, function(data) {
                if(data) {
                    self.protectedzone_popup.show(e.latLng, data);
                }
            });
        },

        disable_editing: function() {
            this.editing(false);
        },

        enable_editing: function() {
            this.editing(true);
        },

        update_report: function(rid, data) {
          if(this.showing === rid) {
            this.show_report(rid, data);
            this.report_polygons = data.polygons.length;
          }
        },

        // render polygons
        show_report: function(rid, data) {
            this.showing = rid;
            this.report_polygons = data.polygons.length;
            var self = this;
            // clean
            _(self.polygons).each(function(p) {
                p.remove();
            });

            // recreate
            _(data.polygons).each(function(paths, i) {
                var p = new PolygonView({
                    mapview: self.map,
                    paths: paths
                });
                p.report = rid;
                p.polygon_id = i;
                p.bind('click', self.start_edit_polygon);
                self.polygons.push(p.render());
            });
        },

        start_edit_polygon: function(p) {
            var self = this;
            this.finish_editing();
            this.editing_poly = p;
            p.hide();
            this.paths = [p.paths];
            this.polygon_edit.editing_state(false);
            this.polygon_edit.edit_polygon(this.paths);
            this.polygon_edit.bind('mousemove', function(p, e) {
                self.popup.show(e.latLng);
            });
            this.map.bind('mousemove', function(e) {
                self.popup.show(e.latLng);
            });
        },

        finish_editing: function() {
            this.polygon_edit.unbind('mousemove');
            this.map.unbind('mousemove');
            this.popup.hide();
            this.polygon_edit.editing_state(true);
        },

        end_edit_polygon: function() {
            this.finish_editing();
            var p = this.editing_poly;
            app.Log.debug("changing polygon", p.report, p.polygon_id);
            this.bus.emit('model:update_polygon', p.report, p.polygon_id, this.paths[0]);
        },

        remove_polygon: function() {
            this.finish_editing();
            var p = this.editing_poly;
            this.bus.emit('model:remove_polygon', p.report, p.polygon_id);
        },

        reorder_layers: function(order) {
            this.map.reorder_layers(order);
        },

        show_controls: function(show) {
            if(show) {
                this.map.show_controls();
                $('.layers').show();
            } else {
                this.map.hide_controls();
                $('.layers').hide();
            }
        }
    });
};
