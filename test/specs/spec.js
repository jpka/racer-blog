describe("racer-blog", function() {  
  var element,
  coll,
  modelData,
  model;

  beforeEach(function(done) {
    this.timeout(5000);
    fixtures.window().racer = null;
    element = fixtures.window().document.querySelector("#blog").cloneNode();
    fixtures.window().document.body.appendChild(element);
    modelData = {
      _page: {
        authorized: true
      },
      blog: {
        posts: {}
      }
    };
    modelData.blog.posts[0] = {body: "one"};
    modelData.blog.posts[1] = {body: "two"};
    modelData.blog.posts[2] = {body: "three"};
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

  it("saving #new generates a new post", function(done) {
    var click = fixtures.window().document.createEvent("MouseEvents");
    click.initEvent("click", true, false);
    element.$.new.model.body = "algo";

    element.$.new.addEventListener("update", function() {
      element.$.new.$.save.dispatchEvent(click);
      setTimeout(function() {
        expect(coll.items.length).to.equal(4);
        expect(coll.items[0].child.$.body.innerHTML).to.include("algo");
        done();
      }, 1000);
    });
    element.$.new.parseBody();
  });

  it("starts with editable rights if authorized", function() {
    expect(coll.items[0].child.editable).to.equal(true);
    expect(element.$.new.style.display).to.not.equal("none");
  });

  it("doesn't start with editable state if not authorized", function(done) {
    var elem = fixtures.window().document.createElement("racer-blog");
    fixtures.window().document.body.appendChild(elem);
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
      element.$.list.push({body: "a"});
      expect(coll.items[0].child.editable).to.not.equal(true);
      done();
    }, 1900);
  });
});
