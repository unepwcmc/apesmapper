
var Report = Backbone.View.extend({

    tagName:  "li",

    template: _.template($('#report-tmpl').html()),

    initialize: function() {
        _.bindAll(this, 'show', 'hide');
    },

    render: function(data) {
        $(this.el).html(this.template(data));
        return this;
    },

    show: function() {
        $(this.el).show();
    },

    hide: function() {
        $(this.el).hide();
    }

});

var Tabs = Backbone.View.extend({

    events: {
        'click .tab': 'click_activate'
    },

    initialize: function() {
        this.tab_el = this.$("ul");
        this.tab_count = 0;
    },

    add_report: function(cid, data) {
        var el = null;
        if(data.total) {
            var li = $("<li><a class='tab' href='#" + cid + "'>total</a></li>");
            this.tab_el.append(li);
            el = li;
        } else {
            this.tab_count++;
            var li = $("<li><a class='tab' href='#" + cid + "'>#"+this.tab_count+"</a></li>");
            li.insertBefore(this.$('#add_report').parent());
            el = li;
        }

        if(el) {
            this.set_enabled($(el));
        }
    },

    clear: function() {
        this.tab_el.html('');
        this.tab_el.append("<li><a id='add_report' href='#add_report'>+</a></li>");
    },

    click_activate: function(e) {
        e.preventDefault();
        this.trigger('enable', $(e.target).attr('href').slice(1));
        this.set_enabled($(e.target).parent());
    },
    
    set_enabled: function(el) {
        this.$('li').removeClass('enabled');
        $(el).addClass('enabled');
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
        this.tabs = new Tabs({el: this.$('#tabs')});
        this.tabs.bind('enable', function() {
        });
    },

    create_report: function(e) {
        e.preventDefault();
        this.trigger("add_report");
    },

    add_report: function(cid, data) {
        var r = new Report(data);
        this.reports.push(r);
        this.reports_map[cid] = r;
        this.el.find("#tab_content").append(r.render(data).el);
        this.tabs.add_report(cid, data);
    },

    remove_all: function() {
        this.tabs.clear();
        this.el.find('#tab_content').html('');
        for(var i = 0; i < this.reports.length; ++i) {
            delete this.reports[i];
        }
        this.reports_map = {};
        this.reports = [];
    },

    update_report: function(cid, data) {
        this.reports_map[cid].render(data);
    },

    show_report: function(cid) {
        //hide all first
        _(this.reports).each(function(r) {
            r.hide();
        });
        this.reports_map[cid].show();
    }

});
