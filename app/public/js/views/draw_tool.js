/*
 ===========================================
 generic tool for polygon drawing over google maps map
 ===========================================
*/
var PolygonDrawTool = Backbone.View.extend({

    initialize: function() {
        _.bindAll(this, 'add_vertex', 'create_polygon', 'reset', 'editing_state', '_add_vertex', 'edit_polygon');
        this.mapview = this.options.mapview;
        this.map = this.mapview.map;
        this.listeners = [];
        this.reset();

        this.image = new google.maps.MarkerImage('/img/sprite.png',
                    new google.maps.Size(13, 13),
                    new google.maps.Point(457, 1234),
                    new google.maps.Point(6,6)
        );
    },

    editing_state: function(editing) {
        this.reset();
        this.mapview.unbind('click', this.add_vertex);
        if(editing) {
            this.mapview.bind('click', this.add_vertex);
        }
    },

    reset: function() {
        var self = this;
        if(this.polyline !== undefined) {
            _(this.listeners).each(function(listener) {
                google.maps.event.removeListener(listener);
            });
            this.listeners = [];
            this.polyline.setMap(null);
            delete this.polyline;
            this.polygon.setMap(null);
            delete this.polygon;
        }
        if(this.markers !== undefined) {
            _.each(this.markers, function(m) {
                m.setMap(null);
            });
        }
        this.markers = [];
        this.vertex = [];
        this.polyline = new google.maps.Polygon({
          path:[],
          //strokeColor: "#DC143C",
          strokeColor: "#FFF",
          strokeOpacity: 1.0,
          fillOpacity: 0.3,
          fillColor: '#66CCCC',
          strokeWeight: 1,
          map: this.map
        });
        this.polygon = new google.maps.Polygon({
          path:[],
          strokeColor: "#DC143C",
          strokeOpacity: 0.8,
          strokeWeight: 0,
          map: this.map
        });

        this.listeners.push(
            google.maps.event.addListener(this.polygon, "click", function(e) {
                self.trigger('polygon_click', this, this.getPath(), e.latLng);
            })
        );
        this.listeners.push(
            google.maps.event.addListener(this.polyline, "mouseover", function(e) {
                self.trigger('mouseover', this, e);
            })
        );
        this.listeners.push(
            google.maps.event.addListener(this.polyline, "mouseout", function(e) {
                self.trigger('mouseout', this, e);
            })
        );
        this.listeners.push(
            google.maps.event.addListener(this.polyline, "mousemove", function(e) {
                self.trigger('mousemove', this, e);
            })
        );

    },

    edit_polygon: function(paths) {
        var self = this;
        self.reset();

        var poly_paths = _.map(paths, function(path) {
            return _.map(path, function(p) {
                return new google.maps.LatLng(p[0], p[1]);
            });
        });

        self.polyline.setPaths(poly_paths);
        self.polyline.setMap(self.map);

        _.each(paths, function(path, path_index) {
            _.each(path, function(p, i) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(p[0], p[1]),
                    map: self.map,
                    icon: self.image,
                    draggable: true,
                    flat : true,
                    raiseOnDrag: false
                });
                marker.path_index = path_index;
                marker.index = i;
                self.markers.push(marker);
                google.maps.event.addListener(marker, "dragstart", function(e) {
                    self.trigger('dragstart');
                });
                google.maps.event.addListener(marker, "drag", function(e) {
                    self.polyline.getPath(this.path_index).setAt(this.index, e.latLng);
                });
                google.maps.event.addListener(marker, "dragend", function(e) {
                    paths[this.path_index][this.index] = [e.latLng.lat(), e.latLng.lng()];
                });

            });
        });

    },

    _add_vertex: function(latLng) {
        var marker = new google.maps.Marker({position:
                latLng,
                map: this.map,
                icon: this.image,
                draggable: false
        });

        marker.index = this.vertex.length;
        this.markers.push(marker);
        this.vertex.push(latLng);
        this.polyline.setPath(this.vertex);
        this.polygon.setPath(this.vertex);
        return marker;
    },

    add_vertex: function(e) {
        var latLng = e.latLng;
        var marker = this._add_vertex(latLng);
        var self = this;
        if (this.vertex.length === 1) {
            google.maps.event.addListener(marker, "click", function() {
                if (self.vertex.length >= 3) {
                  self.create_polygon(self.vertex);
                  self.reset();
                }
            });
        }
    },

    create_polygon: function(vertex) {
        var v = _.map(vertex, function(p) { return [p.lat(), p.lng()]; });
        this.trigger('polygon', {paths: [v]});
    }


});


var PolygonDrawEditTool = PolygonDrawTool.extend({
    initialize: function() {
        this.constructor.__super__.initialize.call(this);
        this.final_polygon = new google.maps.Polygon({
          path:[],
          //strokeColor: "#DC143C",
          strokeColor: "#0099CC",
          strokeOpacity: 1.0,
          fillColor: 'rgba(102, 204, 204, 0.3)',
          fillOpacity: 0.5,
          strokeWeight: 1,
          map: this.map
        });
    },

    editing_state: function(editing) {
        if(editing) {
            this.mapview.bind('click', this.add_vertex);
        } else {
            this.reset();
            this.final_polygon.setPath([]);
            this.mapview.unbind('click', this.add_vertex);
        }
    },

    add_vertex: function(e) {
        this.final_polygon.setPath([]);
        var latLng = e.latLng;
        var marker = this._add_vertex(latLng);
        var self = this;
        if (this.vertex.length === 1) {
            google.maps.event.addListener(marker, "click", function() {
                self.create_polygon(self.vertex);
            });
        }
    },

    create_polygon: function(vertex) {
        // polygon style
        this.final_polygon.setPath(this.polyline.getPath());
        this.reset();
        var v = _.map(vertex, function(p) { return [p.lat(), p.lng()]; });
        this.trigger('polygon', {path: v});
    }


});

