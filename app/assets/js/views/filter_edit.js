/*
 * Categories edit view
 */
App.views.CategoriesFilterEdit = Backbone.View.extend({

    el: jQuery('#categories_filter_edit'),

    events: {
        'click #finish-categories-edit': 'hide',
        'click .open-close': 'openClose',
        'click #categories_selector .show': 'next'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'show', 'hide');
        this.bus = this.options.bus;
        this.categories = this.options.categories;
        this.apes = this.options.apes;
        this.species = this.options.species;

        this.categories.bind('reset', this.render);
        this.bus.on('show_categories_editor', this.show);
    },

    render: function() {
        // get the object to load the categories views into
        var $container = $('div#categories_selector'), _that = this;
        $container.empty();
        // Create a categories view inside $categories for each categories
        this.categories.each(function(categories) {
            var view = new App.views.CategoriesSelector({
                model: categories,
                bus: _that.bus
            });
            $container.append(view.render().el);
        });
        return this;
    },

    show: function() {
      $('div#categories_selector').removeClass('hide')
    },
    hide: function() {
      $('div#categories_selector').addClass('hide')
    },
    next: function(ev) {
      this.apes.each(function(ape) {
        if(ape.get('category_id') == $(ev.target).next('input').val()) {
          ape.set({hidden: false});
        } else {
          ape.set({hidden: true});
        }
      });

      this.species.each(function(sp) {
        if(sp.get('category_id') == $(ev.target).next('input').val()) {
          sp.set({hidden: false});
        } else {
          sp.set({hidden: true});
        }
      });

      this.bus.emit('show_apes_selector');
      this.bus.emit('render_apes');
      this.hide();
    },
    openClose: function(ev) {
      ev.preventDefault();
      $('div#categories_selector').siblings().addClass('hide');
      this.show();
    }
});

/*
 * Categories selection view
 */
App.views.CategoriesSelector = Backbone.View.extend({
    template: JST['_species_selector'],
    className: 'row',
    initialize: function(obj) {
        this.bus = obj.bus;
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
      this.bus.emit('update_list_of_apes');
      this.bus.emit('update_list_of_species');
    }
});
