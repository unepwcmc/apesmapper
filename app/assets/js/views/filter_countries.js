/*
 * Countries edit view
 */
App.views.CountriesFilterEdit = Backbone.View.extend({

    el: jQuery('#countries_filter_edit'),

    events: {
        'click #finish-countries-edit': 'hide'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'show', 'hide', 'filterByRegion');
        this.bus = this.options.bus;
        this.regions = this.options.regions;
        this.countries = this.options.countries;

        this.countries.bind('reset', this.render);
        this.bus.on('show_countries_selector', this.show);
        this.bus.on('update_list_of_countries', this.filterByRegion);
    },

    render: function() {
        // get the object to load the countries views into
        var $countries = this.$('div#countries_selector');
        $countries.empty();
        // Create a countries view inside $countries for each countries
        this.countries.visible().each(function(countries) {
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
        var countries = [];

        _.each($(this.el).find("input[name=countries]:checked"), function(country) {
          countries.push($(country).val());
        });

        this.bus.emit('countries:change', countries);

        this.el.slideUp();
    },
    filterByRegion: function() {
      var selected_regions = this.regions.selected();
      this.countries.each(function(country) {
        if(_.map(selected_regions, function(region){return region.get('id')}).indexOf(country.get('region_id')) === -1){
            country.set({hidden: true});
            country.set({selected: false});
        } else{
            country.set({hidden: false});
          }
      });
      this.render();
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

