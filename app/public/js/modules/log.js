
/*
 =============================================
 log module wrapper
 =============================================
*/

App.modules.Log = function(app) {

    var _fake_console = function() {};
    _fake_console.prototype.error = function(){};
    _fake_console.prototype.log= function(){};

    //IE7 love
    if(typeof console !== "undefined") {
        _console = console;
    } else {
        _console = new _fake_console();
    }

    app.Log = {

        error: function() {
            _console.error.apply(_console, arguments);
        },

        log: function() {
            _console.log.apply(_console, arguments);
        },

        debug: function() {
            _console.log.apply(_console, arguments);
        }
    };
};
