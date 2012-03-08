/*
 * Apes edit view
 */
App.views.ApesFilterEdit = Backbone.View.extend({

    el: jQuery('#categories_filter_edit'),

    events: {
        'click #finish-apes-edit': 'hide',
        'click #apes_selector .show': 'next'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'show', 'hide', 'filterByCategory');
        this.bus = this.options.bus;
        this.categories = this.options.categories;
        this.apes = this.options.apes;
        this.species = this.options.species;

        this.categories.bind('reset', this.render);
        this.apes.bind('reset', this.render);
        this.bus.on('show_apes_selector', this.show);
        this.bus.on('update_list_of_apes', this.filterByCategory);
        this.bus.on('render_apes', this.render);
    },

    render: function() {
        // get the object to load the species views into
        var $container = $('div#apes_selector'), _that = this;
        $container.empty();
        // Create a apes view inside $container for each ape
        this.apes.visible().each(function(apes) {
          var view = new App.views.ApesSelector({
              model: apes,
              bus: _that.bus
          });
          $container.append(view.render().el);
        });
        return this;
    },
    show: function() {
      $('div#apes_selector').removeClass('hide');
    },
    hide: function() {
      $('div#apes_selector').addClass('hide');
    },
    next: function(ev) {
      this.species.each(function(sp) {
        if(sp.get('ape_id') == $(ev.target).next('input').val()) {
          sp.set({hidden: false});
        } else {
          sp.set({hidden: true});
        }
      });

      this.bus.emit('rerender_list_of_species');
      this.bus.trigger('show_species_selector');
      this.hide();
    },
    filterByCategory: function() {
      var selected_categories = _.map(this.categories.selected(), function(category){return category.get('id')});
      this.apes.each(function(ape) {
        if(_.include(selected_categories, ape.get('category_id'))){
          ape.set({selected: true});
        } else{
          ape.set({selected: false});
        }
      });
      this.render();
      this.bus.emit('update_list_of_species');
    }
});

/*
 * Apes selection view
 */
App.views.ApesSelector = Backbone.View.extend({
  template: JST['_species_selector'],
  className: 'row',
  initialize: function(obj) {
    this.bus = obj.bus;
    _.bindAll(this, 'render', 'toggleSelected');
  },
  events: {
    'click .select_all': 'toggleSelected'
  },
  render: function( event ){
    // render the template
    var renderedContent = this.template(this.model.toJSON());
    jQuery(this.el).html(renderedContent);
    return this;
  },
  toggleSelected: function() {
    this.model.toggle();
    this.bus.emit('select_all_by_ape', this.model.get('id'));
  }
});