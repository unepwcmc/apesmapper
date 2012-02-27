/*
 * Regions edit view
 */
App.views.RegionsFilterEdit = Backbone.View.extend({

    el: jQuery('#regions_filter_edit'),

    events: {
        'click #finish-regions-edit': 'hide',
        'click #next-regions-selection': 'next'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'show', 'hide', 'next');
        this.bus = this.options.bus;
        this.regions = this.options.regions;
        this.regions.bind('reset', this.render);
        this.bus.on('show_regions_selector', this.next);
    },

    render: function() {
        // get the object to load the regions views into
        var $regions = this.$('div#regions_selector');
        $regions.empty();
        // Create a regions view inside $regions for each regions
        this.regions.each(function(regions) {
            var view = new App.views.RegionsSelector({
                model: regions
            });
            $regions.append(view.render().el);
        });
        return this;
    },

    show: function() {
      //this.el.slideDown();
    },

    hide: function() {
      //this.el.slideUp();
    },
    next: function() {
      this.bus.emit('update_list_of_countries');
      this.bus.emit('show_countries_selector');
      //this.hide();
    }
});

/*
 * Regions selection view
 */
App.views.RegionsSelector = Backbone.View.extend({
    template: JST['_countries_selector'],
    initialize: function() {
        _.bindAll(this, 'render', 'toggleSelected');
    },
    events: {
      'click input': 'toggleSelected'
    },
    render: function( event ){
        // render the template
        var renderedContent = this.template(this.model.toJSON());
        jQuery(this.el).html(renderedContent);
        return this;
    },
    toggleSelected: function() {
      this.model.toggle();
    }
});

