/**
 * Category model and collection
*/
App.modules.Categories = function(app) {
    var Category = Backbone.Model.extend({
        defaults: function() {
            return {
              selected:  false,
              the_type: "category"
            };
        },
        toggle: function() {
          this.set({selected: !this.get("selected")});
        },
        idAttribute: 'id'
    });

    var AllCategories = Backbone.Collection.extend({
        model: Category,
        url: 'json/categories.json',
        selected: function() {
            return this.filter(function(category){ return category.get('selected'); });
        },
        toUrl: function() {
          var selected_ids = this.selected().map(function(category){ return category.get('id').toString();});
          return _.size(selected_ids) > 0 ? selected_ids.join(",") : "0";
        },
        fromUrl: function(categories_ids) {
        }
    });

    app.Categories = Class.extend({
        init: function() {
            // Initialise the categories collections
            this.allCategories = new AllCategories();
            this.allCategories.fetch();
        }
    });
};

