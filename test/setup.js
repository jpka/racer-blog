window.expect = chai.expect;
window.win = fixtures.window();
window.doc = window.win.document;

before(function(done) {
  fixtures.load("../../../base/test/index.html");
  fixtures.window().console = console;
  fixtures.window().addEventListener("WebComponentsReady", function() {
    done();
  });
});
