
var SharePopup = Backbone.View.extend({
    el: $('.share_tooltip'),

    events: {
        'click .close': 'close'
    },

    initialize: function() {
        _.bindAll(this, 'open');
        this.link_el = this.$('.link');
    },

    close: function(e) {
        if(e) e.preventDefault();
        this.el.hide();
    },

    open: function(loc) {
        loc = loc || location.href;
        this.link_el.html(loc);
        this.el.show();
    }

});
