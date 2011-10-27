
/*
 =============================================
 log module wrapper
 =============================================
*/

App.modules.Log = function(app) {
    app.Log = {

        error: function() {
            console.error.apply(console, arguments);
        },

        log: function() {
            console.log.apply(console, arguments);
        },

        debug: function() {
            console.log.apply(console, arguments);
        }
    };
};
