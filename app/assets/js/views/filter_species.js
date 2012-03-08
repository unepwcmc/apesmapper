/*
 * Species edit view
 */
App.views.SpeciesFilterEdit = Backbone.View.extend({

    el: jQuery('#categories_filter_edit'),

    events: {
      'click .open-close': 'hide'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'show', 'hide', 'filterByApe', 'selectAllByCategory', 'selectAllByApe');
        this.bus = this.options.bus;
        this.apes = this.options.apes;
        this.species = this.options.species;

        this.apes.bind('reset', this.render);
        this.species.bind('reset', this.render);
        this.bus.on('show_species_selector', this.show);
        this.bus.on('update_list_of_species', this.filterByApe);
        this.bus.on('rerender_list_of_species', this.render);
        this.bus.on('select_all_by_category', this.selectAllByCategory);
        this.bus.on('select_all_by_ape', this.selectAllByApe);
    },

    render: function() {
        // get the object to load the species views into
        var $container = $('div#species_selector'), _that = this;
        $container.empty();
        // Create a species view inside $container for each species
        this.species.visible().each(function(species) {
            var view = new App.views.SpeciesSelector({
                model: species,
                bus: _that.bus
            });
            $container.append(view.render().el);
        });

        if(this.species.selected().length === 0) {
          $('#categories_filter_edit span.selected').html('<a href="#"><span class="count">' + this.species.length + '</span> selected</a>')
        } else {
          $('#categories_filter_edit span.selected').html('<a href="#"><span class="count">' + this.species.selected().length + '</span> selected</a>')
        }

        return this;
    },
    show: function() {
      $('div#species_selector').removeClass('hide');
    },
    hide: function() {
      $('div#species_selector').addClass('hide');
    },
    next: function() {
      this.bus.trigger('show_species_selector');
    },
    filterByApe: function() {
      var selected_apes = _.map(this.apes.selected(), function(ape){return ape.get('id')});
      this.species.each(function(species) {
        if(_.include(selected_apes, species.get('ape_id'))){
            species.set({selected: true});
          } else {
            species.set({selected: false});
          }
      });
      this.render();

      var species_arr = [];
      _.each(this.model.collection.selected(), function(s) {
        species_arr.push(s.get('code'));
      });
      this.bus.emit('species:change', species_arr);
    },
    selectAllByCategory: function(category_id) {
      var _that = this;
      this.apes.each(function(ape) {
        if(category_id == ape.get('category_id')) {
          _that.selectAllByApe(ape.get('id'));
        }
      });
    },
    selectAllByApe: function(ape_id) {
      this.species.each(function(species) {
        if(ape_id == species.get('ape_id')) {
          species.set({selected: true});
        }
      });

      if(this.species.selected().length === 0) {
        $('#categories_filter_edit span.selected').html('<a href="#"><span class="count">' + this.species.length + '</span> selected</a>')
      } else {
        $('#categories_filter_edit span.selected').html('<a href="#"><span class="count">' + this.species.selected().length + '</span> selected</a>')
      }

      var species_arr = [];
      _.each(this.species.selected(), function(s) {
        species_arr.push(s.get('code'));
      });
      this.bus.emit('species:change', species_arr);
    }
});

/*
 * Species selection view
 */
App.views.SpeciesSelector = Backbone.View.extend({
  template: JST['_species_selector'],
  className: 'row',
  initialize: function(obj) {
    _.bindAll(this, 'render', 'toggleSelected');
    this.bus = obj.bus;
  },
  events: {
    'click input': 'toggleSelected'
  },
  render: function() {
    // render the template
    var renderedContent = this.template(this.model.toJSON());
    jQuery(this.el).html(renderedContent);
    return this;
  },
  toggleSelected: function() {
    this.model.toggle();

    if(this.model.collection.selected().length === 0) {
      $('#categories_filter_edit span.selected').html('<a href="#"><span class="count">' + this.model.collection.length + '</span> selected</a>')
    } else {
      $('#categories_filter_edit span.selected').html('<a href="#"><span class="count">' + this.model.collection.selected().length + '</span> selected</a>')
    }

    var species_arr = [];
    _.each(this.model.collection.selected(), function(s) {
      species_arr.push(s.get('code'));
    });
    this.bus.emit('species:change', species_arr);
  }
});