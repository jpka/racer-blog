window.expect = chai.expect;

before(function(done) {
  //window.win = fixtures.window();
//window.doc = window.win.document;
  fixtures.load("../../../base/test/index.html");
  fixtures.window().console = console;
  fixtures.window().addEventListener("WebComponentsReady", function() {
    done();
  });
});
