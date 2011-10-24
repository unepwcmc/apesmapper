
// google maps map
var MapView = Backbone.View.extend({
    mapOptions: {
            zoom: 5,
            center: new google.maps.LatLng(-6.653695352486294, 58.743896484375),
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            draggableCursor:'default',
            scrollwheel: false,
            mapTypeControl:false
            /*mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.BOTTOM_LEFT
            }*/
    },

    events: {
            'click .zoom_in': 'zoom_in',
            'click .zoom_out': 'zoom_out'
    },
    //el: $("#map"),

    initialize: function() {
        _.bindAll(this, 'center_changed', 'ready', 'click', 'set_center', 'zoom_changed', 'zoom_in', 'zoom_out', 'adjustSize', 'set_zoom_silence', 'set_center_silence');
       this.map_layers = {};
       // hide controls until map is ready
       this.hide_controls();
       this.map = new google.maps.Map(this.$('.map')[0], this.mapOptions);
       google.maps.event.addListener(this.map, 'center_changed', this.center_changed);
       google.maps.event.addListener(this.map, 'zoom_changed', this.zoom_changed);
       google.maps.event.addListener(this.map, 'click', this.click);
       this.projector = new Projector(this.map);
       this.projector.draw = this.ready;
       this.signals_on = true;
    },

    adjustSize: function() {
        google.maps.event.trigger(this.map, "resize");
    },

    hide_controls: function() {
        this.$('.layer_editor').hide();
        this.$('.zoom_control').hide();
    },

    show_zoom_control: function() {
        this.$('.zoom_control').show();
    },

    hide_zoom_control: function() {
        this.$('.zoom_control').hide();
    },

    show_layers_control: function() {
        this.$('.layer_editor').show();
    },

    hide_layers_control: function() {
        this.$('.layer_editor').hide();
    },

    show_controls: function() {
        this.$('.layer_editor').show();
        this.$('.zoom_control').show();
    },

    center_changed: function() {
        if(this.signals_on) {
            this.trigger('center_changed', this.map.getCenter());
        }
    },

    zoom_in: function(e) {
        e.preventDefault();
        this.map.setZoom(this.map.getZoom() + 1);
    },

    zoom_out: function(e) {
        e.preventDefault();
        this.map.setZoom(this.map.getZoom() - 1);
    },

    zoom_changed: function() {
        if(this.signals_on) {
            this.trigger('zoom_changed', this.map.getZoom());
        }
    },

    set_center: function(c, s) {
        this.signals_on = s === undefined? true: s;
        this.map.setCenter(c);
        this.signals_on = true;
    },

    set_center_silence: function(c) {
        this.set_center(c, false);
    },

    set_zoom: function(z, s) {
        this.signals_on = s === undefined? true: s;
        this.map.setZoom(z);
        this.signals_on = true;
    },

    set_zoom_silence: function(z) {
        this.set_zoom(z, false);
    },

    click: function(e) {
        this.trigger('click', e);
    },

    crosshair: function(onoff) {
        var c = this.$('.crosshair');
        if(onoff) {
            c.show();
        } else {
            c.hide();
        }
    },

    tile_info: function(info) {
        var nfo = this.$('.tiles_info');
        if(info.length > 0) {
            nfo.animate({ bottom: 0});
            nfo.find('span').html(info);
        } else {
            nfo.animate({bottom: -171});
        }
    },

    // called when map is ready
    // its a helper method to avoid calling getProjection whiout map loaded
    ready: function() {
            this.projector.draw = function(){};
            this.show_controls();
            this.trigger('ready');
    }

});
