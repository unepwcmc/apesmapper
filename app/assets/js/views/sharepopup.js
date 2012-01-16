
var SharePopup = Backbone.View.extend({
    el: jQuery('.share_tooltip'),

    events: {
        'click .close': 'close',
        //'focus .link': 'focus',
        'click .link': 'focus'
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
        this.link_el.val(loc);
        this.el.show();
        this.focus();
    },

    focus: function() {
        this.link_el.select();
    }

});
