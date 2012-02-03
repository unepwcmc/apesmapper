/*
 * Species edit view
 */
App.views.SpeciesFilterEdit = Backbone.View.extend({

    el: jQuery('#species_filter_edit'),

    events: {
        'click #finish-species-edit': 'hide'
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
        var $container = this.$('div#species_selector');
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
        this.el.slideDown();
    },
    hide: function() {
      var species = [];

      _.each($(this.el).find("input[name=species]:checked"), function(s) {
        species.push($(s).val());
      });

      this.bus.emit('species:change', species);

      this.el.slideUp();
    },
    next: function() {
      this.bus.trigger('show_species_selector');
    },
    filterByApe: function() {
      var selected_apes = _.map(this.apes.selected(), function(ape){return ape.get('id')});
      this.species.each(function(species) {
        if(_.include(selected_apes, species.get('ape_id'))){
            species.set({hidden: false});
          } else {
            species.set({hidden: true});
            species.set({selected: false});
          }
      });
      this.render();
    }
});

/*
 * Species selection view
 */
App.views.SpeciesSelector = Backbone.View.extend({
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


