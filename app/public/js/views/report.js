
var Report = Backbone.View.extend({

    tagName:  "div",

    template: _.template($('#report-tmpl').html()),
    template_no_content: _.template($('#report-tmpl-no-content').html()),
    template_header: _.template($('#report-tmpl-common').html()),

    events: {
        'click .non_editing .go_edit': 'go_edit',
        'click .non_editing .remove': 'go_remove',
        'click .editing .leave_edit': 'leave_edit',
        'click .removing .cancel': 'leave_edit',
        'click .removing .remove_it_please': 'remove_polygons',
        'mouseover .tooltip li': 'show_tooltip',
        'mouseleave .tooltip li': 'hide_tooltip'
    },

    initialize: function() {
        _.bindAll(this, 'show', 'hide');
        $(this.el).addClass('tab_content_item');
        this.bus = this.options.bus;
        this.header = null;
        this.showing_loading = false;
        this.showing = false;
    },

    render: function(data) {
        var self = this;
        if(data.polygons.length !== 0 || data.total) {
            // check if header has been already rendered and 
            // update only the stats part
            if(this.header) {
                this.$('.report_stats').html(this.template(data));
                this.header.find('.polygon_num').html(data.polygons.length);
            } else {
                if(!data.total) {
                    $(this.el).html(this.template_header(data));
                }
                $(this.el).append(this.template(data));
                this.header = this.$('.stats_header');
            }
            this.leave_edit();
        } else {
            $(this.el).html(this.template_no_content(data));
            this.header = null;
            this.go_edit();
        }
        this.loading(this.showing_loading);
        return this;
    },

    show_tooltip: function(e) {
      var el = $(e.target);
      var tooltip = el.find('.list_tooltip');
      var pos = el.position();
      tooltip.css({top: pos.top - 130, left: pos.left + 120});
      tooltip.show();
    },

    hide_tooltip: function(e) {
      var el = $(e.target);
      var tooltip = el.find('.list_tooltip');
      tooltip.hide();
    },

    go_edit: function(e) {
        if(e) e.preventDefault();
        this.$('.non_editing').hide();
        this.$('.removing').hide();
        this.$('.editing').show();
        if(this.showing)
          this.bus.emit('map:edit_mode');
    },

    leave_edit: function(e) {
        if(e) e.preventDefault();
        this.$('.editing').hide();
        this.$('.removing').hide();
        this.$('.non_editing').show();
        if(this.showing)
          this.bus.emit('map:no_edit_mode');
    },
  
    go_remove: function(e) {
        if(e) e.preventDefault();
        this.$('.editing').hide();
        this.$('.non_editing').hide();
        this.$('.removing').show();
    },

    remove_polygons: function(e) {
      if(e) e.preventDefault();
      this.bus.emit("model:clear");
    },

    show: function() {
        this.showing = true;
        $(this.el).show();
    },

    hide: function() {
        this.showing = false;
        $(this.el).hide();
    },

    loading: function(b) {
        this.showing_loading = b;
        if(this.header) {
            var loading = this.header.find('.loader');
            var add_poly = this.header.find('.editing_tools');
            if(b) {
                add_poly.animate({'margin-top': '-44px'}, 1000);
            } else {
                //this.leave_edit();
                add_poly.animate({'margin-top': '0px'}, 1000);
            }
        }
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
        var area = '0';
        if(data && data.stats && data.stats.carbon) {
            area =  (data.stats.carbon.area/1000000).toFixed(0);
        }
        if(data && data.stats && data.stats.carbon_sum) {
            area =  (data.stats.carbon_sum.area/1000000).toFixed(0);
        }
        if(data.total) {
            var li = $("<li class='total'><a class='tab' href='#" + cid + "'>summary</a><span class='stats'><span class='stats_inner'><h5>AOIs SUMMARY</h5><p><span class='area'>"+ area +"</span> km<sup>2</sup> in total</p></span></span></li>");
            this.tab_el.append(li);
            el = li;
        } else {
            this.tab_count++;
            var li = $("<li><a class='tab' href='#" + cid + "'>#"+this.tab_count+"</a><span class='stats'><span class='stats_inner'><h5>AOI #"+this.tab_count+"</h5><p><span class='area'>"+ area +"</span> km<sup>2</sup></p></span></span></li>");
            li.insertBefore(this.$('#add_report').parent());
            el = li;
        }

        // remove add if is needed
        if(this.tab_count == 3) {
            this.tab_el.find('#add_tab').remove();
        }

        if(el) {
            this.set_enabled($(el));
        }
    },

    update: function(rid, data) {
        var a = null;
        if(data.stats.carbon) {
            a = data.stats.carbon.area;
        } else if (data.stats.carbon_sum) {
            a = data.stats.carbon_sum.area;
        }
        if(a)
            this.tab_el.find("a[href=#" + rid +"]").parent().find('.area').html((a/100000).toFixed(0));
    },

    clear: function() {
        this.tab_el.html('');
        this.tab_el.append("<li id='add_tab'><a id='add_report' href='#add_report'>+</a></li>");
        this.tab_count = 0;
    },

    click_activate: function(e) {
        e.preventDefault();
        //this.trigger('enable', $(e.target).attr('href').slice(1));
        //IE7 love
        this.trigger('enable', $(e.target).attr('href').split('#')[1]);
        this.set_enabled($(e.target).parent());
    },

    show_tab: function(rid) {
      var el = this.tab_el.find("a[href=#" + rid +"]").parent();
      this.set_enabled($(el));
    },

    set_enabled: function(el) {
        this.$('li').removeClass('enabled').removeAttr('style');
        $(el).addClass('enabled');
        if ($(el).hasClass('total')) {
            var li_w = 0;
            this.tab_el.find('li').each(function(i,li){li_w += $(li).width()});
            var width = this.tab_el.width() - li_w + 66;
            $(el).find('span.stats').width(width);
        } else {
            var width = $(el).find('span.stats').width();
            $(el).width(width+38);
        }
    }
});


var Panel = Backbone.View.extend({
    el : $('#panel'),

    events: {
        'click #add_report': 'create_report'
    },

    initialize: function() {
        _.bindAll(this, 'add_report', 'create_report');
        var self = this;
        this.bus = this.options.bus;
        this.reports = [];
        this.reports_map = {};
        this.tabs = new Tabs({el: this.$('#tabs')});
        this.tabs.bind('enable', function() {
        });
        this.tab_contents = this.$('#tab_content');
        this.bus.on('loading_started', function() {
            _(self.reports).each(function(r) {
                r.loading(true);
            });
        });
        this.bus.on('loading_finished', function() {
            _(self.reports).each(function(r) {
                r.loading(false);
            });
        });
    },

    create_report: function(e) {
        e.preventDefault();
        this.trigger("add_report");
    },

    add_report: function(cid, data) {
        var r = new Report({
            bus: this.bus
        });
        this.reports.push(r);
        this.reports_map[cid] = r;
        this.tab_contents.append(r.render(data).el);
        this.tabs.add_report(cid, data);
    },

    remove_all: function() {
        this.tabs.clear();
        this.tab_contents.html('');
        for(var i = 0; i < this.reports.length; ++i) {
            delete this.reports[i];
        }
        this.reports_map = {};
        this.reports = [];
    },

    update_report: function(cid, data) {
        this.reports_map[cid].render(data);
        this.tabs.update(cid, data);
    },

    show_report: function(cid) {
        //hide all first
        _(this.reports).each(function(r) {
            r.hide();
        });
        this.reports_map[cid].show();
        this.tabs.show_tab(cid);
    },

    hide: function() {
        this.el.hide();
    },

    show: function() {
        this.el.show();
    }

});
