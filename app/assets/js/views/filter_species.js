/*
 * Species edit view
 */
App.views.SpeciesFilterEdit = Backbone.View.extend({

    el: jQuery('#categories_filter_edit'),

    events: {
      'click .open-close': 'hide'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'show', 'hide', 'filterByApe');
        this.bus = this.options.bus;
        this.apes = this.options.apes;
        this.species = this.options.species;

        this.apes.bind('reset', this.render);
        this.species.bind('reset', this.render);
        this.bus.on('show_species_selector', this.show);
        this.bus.on('update_list_of_species', this.filterByApe);
    },

    render: function() {
        // get the object to load the species views into
        var $container = $('div#species_selector');
        $container.empty();
        // Create a species view inside $container for each species
        this.species.visible().each(function(species) {
            var view = new App.views.SpeciesSelector({
                model: species
            });
            $container.append(view.render().el);
        });
        return this;
    },
    show: function() {
      $('div#species_selector').removeClass('hide')
    },
    hide: function() {
      var species_arr = [];

      _.each($(this.el).find("#species_selector input:checked"), function(s) {
        species_arr.push($(s).val());
      });

      this.bus.emit('species:change', species_arr);

      $('div#species_selector').addClass('hide');
      $('#categories_filter_edit span.selected').html('<a href="#"><span class="count">' + this.species.selected().length + '</span> selected</a>')
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
      $('#categories_filter_edit span.selected').html('<a href="#"><span class="count">' + this.species.selected().length + '</span> selected</a>')
    }
});

/*
 * Species selection view
 */
App.views.SpeciesSelector = Backbone.View.extend({
    template: JST['_species_selector'],
    className: 'row',
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


