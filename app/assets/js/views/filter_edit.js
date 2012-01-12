/*
 * Filter edit view, contains species and country selector
 */

App.views.FilterEdit = Backbone.View.extend({

    el: $('#filter_edit'),

    events: {
        'click #save_filter': 'hide'
    },

    initialize: function() {
        _.bindAll(this, 'render');
        this.bus = this.options.bus;
        this.apes = this.options.apes;
        this.countries = this.options.countries;
        this.bus.on('app:work_loaded', this.enable_select);
        this.bus.on('edit_filter:click', this.show);

        this.apes.bind('reset', this.render);
        this.countries.bind('reset', this.render);
    },

    render: function() {
        // get the object to load the species views into
        var $species = this.$('#species_selector');
        $species.empty();
        // Create a species view inside $species for each species
        this.apes.each(function(species) {
            var view = new App.views.SpeciesSelector({
                model: species
            });
            $species.append(view.render().el);
        });

        // get the object to load the species views into
        var $countries = this.$('#countries_selector');
        $countries.empty();
        // Create a species view inside $species for each species
        this.countries.each(function(countries) {
            var view = new App.views.CountriesSelector({
                model: countries
            });
            $countries.append(view.render().el);
        });
        return this;
    },

    show: function() {
        $('#filter_edit').show();
    },

    hide: function() {
        this.el.hide();
        this.bus.emit('save_filter:click');
    },

    enable_select: function() {
        // Enables saving the filter changes
        $('#save_filter span.button_info').text('Filter');
        $('#save_filter').removeAttr('disabled');
    }
});

/*
 * Species selection view
 */
App.views.SpeciesSelector = Backbone.View.extend({

    initialize: function() {
        _.bindAll(this, 'render', 'toggleSelected');

        this.template = _.template( $("#species-selector-tmpl").html() );
    },
    events: {
      'click input': 'toggleSelected'
    },
    render: function( event ){
        // render the template
        var renderedContent = this.template(this.model.toJSON());
        $(this.el).html(renderedContent);
        return this;
    },
    toggleSelected: function() {
      this.model.toggle();
    }
});

/*
 * Countries selection view
 */
App.views.CountriesSelector = Backbone.View.extend({

    initialize: function() {
        _.bindAll(this, 'render', 'toggleSelected');

        this.template = _.template( $("#countries-selector-tmpl").html() );
    },
    events: {
      'click input': 'toggleSelected'
    },
    render: function( event ){
        // render the template
        var renderedContent = this.template(this.model.toJSON());
        $(this.el).html(renderedContent);
        return this;
    },
    toggleSelected: function() {
      this.model.toggle();
    }
});