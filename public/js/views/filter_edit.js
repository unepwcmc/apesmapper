/*
 * Filter edit view, contains species and country selector
 */

App.views.FilterEdit = Backbone.View.extend({

    el: $('#filter_edit'),

    events: {
        'click #save_filter': 'update_filter'
    },

    initialize: function() {
        this.bus = this.options.bus;
        this.apes = this.options.apes;
        this.bus.on('app:work_loaded', this.enable_select);
        // create the species selector view
        this.speciesSelector = new App.views.SpeciesSelector({collection: this.apes});
    },

    update_filter: function(e) {
      alert('clicked');
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
    }
});

/*
 * Species selection view
 */
App.views.SpeciesSelector = Backbone.View.extend({
    el: $('#species_selector'),

    initialize: function() {
      this.collection.bind('reset', this.render, this);
    },
    render: function( event ){
      var compiled_template = _.template( $("#species-selector-tmpl").html() );
      this.el.html( compiled_template({apes:this.collection.toJSON()}));
      return this;
    },
});
