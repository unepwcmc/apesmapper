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
        // selections contains only the selected elements
        var renderedContent, selections = {
            apes: _.map(this.apes.selected(), function(ape){
               return ape.toJSON();
            })
        }
        // render the template
        renderedContent = this.template(selections);
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
