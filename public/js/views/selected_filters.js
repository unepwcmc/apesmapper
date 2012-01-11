/*
 * View the currently selected filters (apes and countries)
 */
App.views.SelectedFilters = Backbone.View.extend({

    el: $('#selected_filters'),

    events: {
        'click #save_filter': 'hide'
    },

    initialize: function() {
        _.bindAll(this, 'render');

        this.bus = this.options.bus;
        this.apes = this.options.apes;
        this.template = _.template( $("#selected-filters-tmpl").html() );
        
        // TODO change bindings
    },

    render: function() {
        var selections = {
            apes: _.map(this.apes.selected(), function(ape){
               ape.toJSON();
            })
        }
        // render the template
        var renderedContent = this.template(selections);
        $(this.el).html(renderedContent);
        return this;
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
