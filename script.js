Polymer("racer-blog", {
  applyAuthorStyles: true,
  collectionPath: "",

  ready: function() {
    var self = this;

    this.setNew();
    this.$.new.parseBody();
    this.$.list.addEventListener("item", function(e) {
      e.detail.child.softUpdates = true;
      e.detail.onChildDelete = function() {
        this.set("status", "deleted");
      };
    });
  },
  get posts() {
    return this.$.list.items;
  },
  set racer(racer) {
    var self = this;

    racer.ready(function(model) {
      self.model = model;
    });
  },
  get model() {
    return this._model;
  },
  set model(model) {
    var self = this,
    query;

    if (model.get("_page.authorized")) {
      this._authorize();
    }
    model.on("error", function(err) {
      if (err.message === "unauthorized") {
        self._unauthorize();
      }
    });
    this._model = model;

    model.fn("published", function(item) {
      return item && item.status === "published";
    });

    this.$.list.model = model.at(this.collectionPath);
  },
  _authorize: function() {
    this.$.list.itemAttributes = {editable: true};
    this.$.new.style.display = "block";
  },
  _unauthorize: function() {
    this.$.list.itemAttributes.editable = null;
    this.$.new.style.display = "none";
    this.posts.forEach(function(post) {
      post.reset();
      post.child.editable = false;
    });
  },
  setNew: function() {
    this.$.new.model = {
      title: "title",
      body: "body",
      status: "published"
    };
  },
  addNew: function() {
    var model = this.$.new.model;
    model.date = (new Date()).toString();
    this.$.list.push(model);
    this.setNew();
  }
});