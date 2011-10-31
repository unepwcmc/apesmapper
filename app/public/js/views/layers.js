
var Layer = Backbone.View.extend({

    template: _.template('<%= name %>'),

    tagName: 'li',

    events: {
      'click': 'toggle'
    },

    initialize: function(layer) {
        this.layer = layer;
    },

    render: function() {
        $(this.el).html(
            this.template(this.layer)
        ).addClass('sortable').attr('id', this.layer.name);
        return this;
    },

    toggle: function() {
        this.trigger();
    }

});

var LayerEditor = Backbone.View.extend({


    events: {
        'click .expand': 'expand'
    },

    initialize: function() {
        var self = this;
        this.layers = this.options.layers;
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
        el.html('');
        _(this.layers.slice(0, howmany)).each(function(layer) {
            var v = new Layer(layer);
            self.views[layer.name] = v;
            el.append(v.render().el);
        });
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
        this.$('li').each(function(el) {
        });
    }

});
