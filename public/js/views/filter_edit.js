/*
 * Filter edit view, contains species and country selector
 */

App.views.FilterEdit = Backbone.View.extend({

    el: $('#filter_edit'),

    events: {
        'click #save_filter': 'update_filter'
    },

    initialize: function() {
        _.bindAll(this, 'render');
        this.bus = this.options.bus;
        this.apes = this.options.apes;
        this.bus.on('app:work_loaded', this.enable_select);

        this.apes.bind('reset', this.render);
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
        return this;
    },

    update_filter: function(e) {
        
    },

    show: function() {
        this.el.show();
    },

    hide: function() {
        this.el.hide();
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
        _.bindAll(this, 'render');

        this.template = _.template( $("#species-selector-tmpl").html() );
    },
    render: function( event ){
        // render the template
        var renderedContent = this.template(this.model.toJSON());
        $(this.el).html(renderedContent);
        return this;
    },
});
