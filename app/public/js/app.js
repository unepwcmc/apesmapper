
function App() {
  var args = Array.prototype.slice.call(arguments),
  callback = args.pop(),
  modules = (args[0] && typeof args[0] === "string") ? args : args[0],
  config,
  i;

  if (!(this instanceof App)) {
    return new App(modules, callback);
  }

  if (!modules || modules === '*') {
    modules = [];
    for (i in App.modules) {
      if (App.modules.hasOwnProperty(i)) {
        modules.push(i);
      }
    }
  }

  for (i = 0; i < modules.length; i += 1) {
    App.modules[modules[i]](this);
  }

  callback(this);
  return this;
}

App.modules = {};
