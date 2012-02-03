/*
 * Apes edit view
 */
App.views.ApesFilterEdit = Backbone.View.extend({

    el: jQuery('#apes_filter_edit'),

    events: {
        'click #finish-apes-edit': 'hide',
        'click #next-apes-selection': 'next'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'show', 'hide', 'filterByCategory');
        this.bus = this.options.bus;
        this.categories = this.options.categories;
        this.apes = this.options.apes;

        this.categories.bind('reset', this.render);
        this.apes.bind('reset', this.render);
        this.bus.on('show_apes_selector', this.show);
        this.bus.on('update_list_of_apes', this.filterByCategory);
    },

    render: function() {
        // get the object to load the species views into
        var $container = this.$('div#apes_selector');
        $container.empty();
        // Create a apes view inside $container for each ape
        this.apes.visible().each(function(apes) {
            var view = new App.views.ApesSelector({
                model: apes
            });
            $container.append(view.render().el);
        });
        return this;
    },
    show: function() {
        this.el.slideDown();
    },
    hide: function() {
      this.el.slideUp();
    },
    next: function() {
      this.bus.emit('update_list_of_species');
      this.bus.trigger('show_species_selector');
      this.hide();
    },
    filterByCategory: function() {
      var selected_categories = _.map(this.categories.selected(), function(category){return category.get('id')});
      this.apes.each(function(ape) {
        if(_.include(selected_categories, ape.get('category_id'))){
          ape.set({hidden: false});
        } else{
          ape.set({hidden: true});
          ape.set({selected: false});
        }
      });
      this.render();
    }
});

/*
 * Apes selection view
 */
App.views.ApesSelector = Backbone.View.extend({
    template: JST['_species_selector'],
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

