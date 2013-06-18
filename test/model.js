window.Model = function(modelData, populated) {
  var model = {
    events: {},
    digIn: function(path) {
      var data = this.data;
      path.split(".").forEach(function(key) {
        if (!data) return;
        data = data[key];
      });
      return data;
    },
    get: function(path) {
      var data = this.data;
      if (path) data = this.digIn(path);
      return data;
    },
    on: function(name, path, cb) {
      if (arguments.length === 2) cb = path;
      if (!this.events[name]) {
        this.events[name] = [];
      }
      this.events[name].push(cb);
    },
    emit: function() {
      var args = arguments;
      if (this.events["all"]) {
        this.events["all"].forEach(function(cb) {
          cb.apply(this, args);
        });
      }
      if (this.events[args[0]]) {
        this.events[args[0]].forEach(function(cb) {
          if (!cb) return;
          cb.apply(this, [].slice.call(args, 1));
        });
      }
    },
    subscribe: function(cb) {
      var self = this;

      setTimeout(function() {
        self.data = modelData;
        cb();
      }, 500);
    },
    at: function(path) {
      return new Model(this.digIn(path), true);
    },
    get: function(path) {
      var data = this.data;
      if (path) data = this.digIn(path);
      return data;
    },
    set: function(path, value) {
      var pathArr = path.split("."),
      key = pathArr.pop();

      this.digIn(pathArr.join("."))[key] = value;
      this.emit(path, "change", value);
    },
    push: function(path, model) {
      return this.insert(path, this.digIn(path).length, model);
    },
    insert: function(path, i, model) {
      var stuff = this.digIn(path);
      if (i >= stuff.length) {
        stuff.push(model);
      } else {
        stuff.splice(i, 0, model)
      }
      this.emit(path, "insert", i, model);
      return stuff.length;
    },
    del: function() {
      this.delWasCalledWith = arguments;
      this.emit(arguments[0], "remove", arguments[1]);
      this.digIn(arguments[0]).splice(arguments[1], 1);
    }
  };

  model.data = {
    _page: modelData._page || {}
  };

  if (populated) {
    model.data = modelData;
    model.subscribe = null;
  }

  return model;
};
