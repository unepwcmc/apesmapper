
var Result = Backbone.Model.extend({
});

var SearchResults = Backbone.Collection.extend({
    model: Result,

    initialize: function() {
        this.geocoder = new google.maps.Geocoder();
    },

    fetch: function() {
        var self = this;
        this.geocoder.geocode( { 'address': this.to_search }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            self.reset(results);
          }
        });
    }

});

var Searchbox = Backbone.View.extend({

    events: {
        'click a': 'typing'
    },

    initialize: function() {
        _.bindAll(this, 'typing', 'goto', 'keyPress');
        var self = this;
        this.results = new SearchResults();
        this.to_search = this.$('input');
        this.results.bind('reset', function() {
          var r = this.first().get('geometry').location;
          var bounds = this.first().get('geometry').bounds;
          self.trigger('goto', r, bounds);
        });
        jQuery(document).bind('keydown', this.keyPress);
    },

    typing: function(e) {
        if(e) e.preventDefault();
        this.results.to_search = this.to_search.val();
        this.results.fetch();
    },

    goto: function(e) {
        e.preventDefault();
    },

    keyPress: function(e) {
        if (e.keyCode == 13 || e.which == 13) { //lovely
            this.typing();
        }
    }


});
