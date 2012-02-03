/*
 * Categories edit view
 */
App.views.CategoriesFilterEdit = Backbone.View.extend({

    el: jQuery('#categories_filter_edit'),

    events: {
        'click #finish-categories-edit': 'hide',
        'click #next-categories-selection': 'next'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'show', 'hide');
        this.bus = this.options.bus;
        this.categories = this.options.categories;

        this.categories.bind('reset', this.render);
        this.bus.on('show_categories_editor', this.show);
    },

    render: function() {
        // get the object to load the categories views into
        var $container = this.$('div#categories_selector');
        $container.empty();
        // Create a categories view inside $categories for each categories
        this.categories.each(function(categories) {
            var view = new App.views.CategoriesSelector({
                model: categories
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
      this.bus.emit('update_list_of_apes');
      this.bus.emit('show_apes_selector');
      this.hide();
    }
});

/*
 * Categories selection view
 */
App.views.CategoriesSelector = Backbone.View.extend({
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
