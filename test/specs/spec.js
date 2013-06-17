describe("racer-blog", function() {  
  var element,
  coll,
  modelData,
  model;

  beforeEach(function(done) {
    fixtures.window().racer = null;
    element = fixtures.window().document.querySelector("#blog").cloneNode();
    modelData = {
      _page: {
        authorized: true
      },
      blog: {
        posts: [
          {body: "body"},
          {body: "another body"},
          {body: "yet another body"}
        ]
      }
    };
    model = new fixtures.window().Model(modelData);
    element.racer = {
      ready: function(cb) {
        cb(model);
      }
    };
    coll = element.$.list;
    element.addEventListener("load", function() {
      done();
    });
  });

  it("generates all the posts in reverse order of the model's array", function() {
    var posts = modelData.blog.posts;
    expect(coll.items.length).to.equal(3);
    expect(coll.items[0].child.$.body.innerHTML).to.include(posts[2].body);
    expect(coll.items[1].child.$.body.innerHTML).to.include(posts[1].body);
    expect(coll.items[2].child.$.body.innerHTML).to.include(posts[0].body);
  });

  it("pressing add generates an empty post at the top", function() {
    var click = document.createEvent("MouseEvents");
    click.initEvent("click");
    element.$.new.dispatchEvent(click);

    expect(coll.items.length).to.equal(4);
    expect(coll.items[0].child.$.body.innerHTML).to.equal("");
  });

  it("pressing post remove button deletes the post from the model", function(done) {
    var click = document.createEvent("MouseEvents");
    click.initEvent("click");

    element.addEventListener("post:delete", function() {
      expect(model.delWasCalledWith).to.deep.equal(["blog.posts", 0, 1]);
      expect(coll.items.length).to.equal(2);
      done();
    });
    coll.items[0].child.$.remove.dispatchEvent(click);
  });

  it("starts with editable rights if authorized", function() {
    expect(coll.items[0].child.editable).to.equal(true);
    expect(element.$.new.style.display).to.not.equal("none");
  });

  it("doesn't start with editable state if not authorized", function(done) {
    var elem = fixtures.window().document.createElement("racer-blog");
    elem.collectionPath = "blog.posts";
    elem.addEventListener("load", function() {
      expect(elem.$.list.items[0].child.editable).to.not.equal(true);
      expect(elem.$.new.style.display).to.equal("none");
      done();
    });
    elem.model = fixtures.window().Model({blog: modelData.blog});
  });

  it("reverts back to non-editable state if model emits unauthorized error", function(done) {
    model.emit("error", {message: "unauthorized"});
    setTimeout(function() {
      expect(coll.items[0].child.editable).to.not.equal(true);
      expect(element.$.new.style.display).to.equal("none");
      element.addNew();
      expect(coll.items[0].child.editable).to.not.equal(true);
      done();
    }, 1000);
  });
});
