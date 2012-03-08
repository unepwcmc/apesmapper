/*
 * Categories edit view
 */
App.views.CategoriesFilterEdit = Backbone.View.extend({

    el: jQuery('#categories_filter_edit'),

    events: {
        'click #finish-categories-edit': 'hide',
        'click .open-close': 'openClose',
        'click .clear_all': 'clearAll',
        'click .back-button': 'back',
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

      $('#categories_filter_edit .back-button').removeClass('hide');

      this.bus.emit('show_apes_selector');
      this.bus.emit('render_apes');
      this.hide();
    },
    openClose: function(ev) {
      ev.preventDefault();
      if(!$(ev.target).parents('.slide-block').hasClass('active')) {
        $('div#categories_selector').siblings().addClass('hide');
        $('#categories_filter_edit .back-button').addClass('hide');
        this.show();
      }
    },
    back: function(ev) {
      ev.preventDefault();
      $('div#categories_selector').parent().children('.box').not('.hide').addClass('hide').prev('.box').removeClass('hide');
      if($('div#categories_selector').parent().children('.box').not('.hide').prev('.box').length === 0) {
        $('#categories_filter_edit .back-button').addClass('hide');
      }
    },
    clearAll: function() {
      this.species.each(function(species) {
        species.set({selected: false});
      });
      
      var species_arr = [];
      _.each(this.species.selected(), function(s) {
        species_arr.push(s.get('code'));
      });
      this.bus.emit('species:change', species_arr);

      $('#categories_filter_edit span.selected').html('<a href="#"><span class="count">' + this.species.length + '</span> selected</a>')
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
    'click .select_all': 'toggleSelected'
  },
  render: function() {
    // render the template
    var renderedContent = this.template(this.model.toJSON());
    jQuery(this.el).html(renderedContent);
    return this;
  },
  toggleSelected: function() {
    this.bus.emit('select_all_by_category', this.model.get('id'));
  }
});
