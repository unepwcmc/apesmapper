/*
 * Species selection view
 */
var SpeciesSelector = Backbone.View.extend({
    el: $('#species_selector'),

    initialize: function() {
      this.collection.bind('reset', this.render, this);
    },
    render: function( event ){
      var compiled_template = _.template( $("#species-selector-tmpl").html() );
      this.el.html( compiled_template({apes:this.collection.toJSON()}));
      return this;
    },
});
