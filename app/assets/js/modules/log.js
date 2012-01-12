
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

    // error tracking!
    window.onerror = function(m, u, l) {
        app.Log.to_server(u + "(" + l + "):" + m);
    };

    app.Log = {

        error: function() {
            _console.error.apply(_console, arguments);
        },

        log: function() {
            _console.log.apply(_console, arguments);
        },

        debug: function() {
            _console.log.apply(_console, arguments);
        },

        to_server: function() {
            //append browser string
            var binfo = [];
            jQuery.each(jQuery.browser, function(i, val) {
                binfo.push(i + ":" + val);
            });
            $.post('/api/v0/error',binfo.join(',') + "=>" + Array.prototype.slice.call(arguments).join(''));
        }
    };
};
