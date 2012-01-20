/*
 * Species edit view
 */
App.views.SpeciesFilterEdit = Backbone.View.extend({

    el: jQuery('#species_filter_edit'),

    events: {
        'click #finish-species-edit': 'hide'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'show', 'hide');
        this.bus = this.options.bus;
        this.apes = this.options.apes;

        this.apes.bind('reset', this.render);
        this.bus.on('show_species_editor', this.show);
    },

    render: function() {
        // get the object to load the species views into
        var $species = this.$('div#species_selector');
        $species.empty();
        // Create a species view inside $species for each species
        this.apes.each(function(species) {
            var view = new App.views.SpeciesSelector({
                model: species
            });
            $species.append(view.render().el);
        });
        return this;
    },

    show: function() {
        this.el.slideDown();
    },

    hide: function() {
        this.el.slideUp();
    }
});

/*
 * Species selection view
 */
App.views.SpeciesSelector = Backbone.View.extend({

    initialize: function() {
        _.bindAll(this, 'render', 'toggleSelected');

        this.template = _.template( jQuery("#species-selector-tmpl").html() );
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

/*
 * Countries edit view
 */
App.views.CountriesFilterEdit = Backbone.View.extend({

    el: jQuery('#countries_filter_edit'),

    events: {
        'click #finish-countries-edit': 'hide'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'show', 'hide');
        this.bus = this.options.bus;
        this.countries = this.options.countries;

        this.countries.bind('reset', this.render);
        this.bus.on('show_countries_editor', this.show);
    },

    render: function() {
        // get the object to load the countries views into
        var $countries = this.$('div#countries_selector');
        $countries.empty();
        // Create a countries view inside $countries for each countries
        this.countries.each(function(countries) {
            var view = new App.views.CountriesSelector({
                model: countries
            });
            $countries.append(view.render().el);
        });
        return this;
    },

    show: function() {
        this.el.slideDown();
    },

    hide: function() {
        this.el.slideUp();
    }
});

/*
 * Countries selection view
 */
App.views.CountriesSelector = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render', 'toggleSelected');

        this.template = _.template( jQuery("#countries-selector-tmpl").html() );
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
