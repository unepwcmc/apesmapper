
var Report = Backbone.View.extend({

    tagName:  "li",

    template: _.template($('#report-tmpl').html()),

    initialize: function() {
    },

    render: function(data) {
        $(this.el).html(this.template(data));
        return this;
    }

});


var Panel = Backbone.View.extend({
    el : $('#panel'),

    events: {
        'click #add_report': 'create_report'
    },

    initialize: function() {
        _.bindAll(this, 'add_report', 'create_report');
        this.reports = [];
        this.reports_map = {};
    },

    create_report: function(e) {
        e.preventDefault();
        this.trigger("add_report");
    },

    add_report: function(cid, data) {
        var r = new Report(data);
        this.reports.push(r);
        this.reports_map[cid] = r;
        this.el.find("ul").append(r.render(data).el);
    },

    remove_all: function() {
        this.el.find('ul').html('');
        for(var i = 0; i < this.reports.length; ++i) {
            delete this.reports[i];
        }
        this.reports_map = {};
        this.reports = [];
    },

    update_report: function(cid, data) {
        this.reports_map[cid].render(data);
    }

});
