
function App() {
  var args = Array.prototype.slice.call(arguments),
  callback = args.pop(),
  modules = (args[0] && typeof args[0] === "string") ? args : args[0],
  config,
  i;

  // allow function to be called without new
  if (!(this instanceof App)) {
    return new App(modules, callback);
  }

  // If modules not set, or is *, add every App.module to modules
  if (!modules || modules === '*') {
    modules = [];
    for (i in App.modules) {
      if (App.modules.hasOwnProperty(i)) {
        modules.push(i);
      }
    }
  }

  // Initialise the modules with this
  for (i = 0; i < modules.length; i += 1) {
    App.modules[modules[i]](this);
  }

  callback(this);
  return this;
}

App.modules = {};
App.views = {};
