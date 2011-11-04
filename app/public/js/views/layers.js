
var Layer = Backbone.View.extend({

    template: _.template('<%= name %>'),

    tagName: 'li',

    events: {
      'click': 'toggle'
    },

    initialize: function(layer) {
        var self = this;
        this.layer = this.options.layer;
        this.bus = this.options.bus;
        this.bus.on('map:enable_layer', function(name, enabled) {
            if(name === self.layer.name) {
                if(enabled) {
                    $(self.el).addClass('enabled');
                }
                else {
                    $(self.el).removeClass('enabled');
                }
            }
        });
    },

    render: function() {
        var el = $(this.el);
        el.html(
            this.template(this.layer)
        ).addClass('sortable').attr('id', this.layer.name);
        if(this.layer.enabled) {
            el.addClass('enabled');
        }
        
        return this;
    },

    toggle: function() {
        this.bus.emit('map:enable_layer', this.layer.name, !this.layer.enabled);
    }

});

var LayerEditor = Backbone.View.extend({


    events: {
        'click .expand': 'expand',
        'mouseleave': 'hiding'
    },

    initialize: function() {
        var self = this;
        this.layers = this.options.layers;
        this.bus = this.options.bus;
        this.views = {};
        this.render();
    },

    expand: function(e) {
        if(e) {
            e.preventDefault();
        }
        this.render(this.layers.length);
    },

    render: function(howmany) {
        howmany = howmany || 3;
        var self = this;
        var el = this.$('.dropdown');
        el.find('li').each(function(i,el){$(el).remove()});
        _(this.layers.slice(0, howmany)).each(function(layer) {
            var v = self.views[layer.name];
            if (v) {
                delete self.views[layer.name];
            }
            var v = new Layer({
                    layer: layer,
                    bus: self.bus
            });
            self.views[layer.name] = v;
            el.find('a.expand').before(v.render().el);
            //el.append(v.render().el);
        });
        if(howmany === self.layers.length) {
            this.$('a.expand').hide();
        } else {
            this.$('a.expand').show();
        }
        el.sortable({
          revert: false,
          items: '.sortable',
          axis: 'y',
          cursor: 'pointer',
          stop:function(event,ui){
            $(ui.item).removeClass('moving');
            //
            //DONT CALL THIS FUNCTION ON beforeStop event, it will crash :D
            //
            self.sortLayers();
          },
          start:function(event,ui){
            $(ui.item).addClass('moving');
          }
        });
        return this;
    },

    sortLayers: function() {
        var order = [];
        this.$('li').each(function(i, el) {
            order.push($(el).attr('id'));
        });
        this.bus.emit("map:reorder_layers", order);
    },

    hiding: function(e) {
        // put first what are showing
        this.layers.sort(function(a, b) {
            if(a.enabled && !b.enabled) {
                return -1;
            } else if(!a.enabled && b.enabled) {
                return 1;
            }
            return 0;
        });
        layers = _(this.layers).pluck('name');
        this.bus.emit("map:reorder_layers", layers);
        this.order = layers;
        this.render(3);
    }

});
