var express = require("express"),
fs = require("fs"),
path = require("path"),
app = express();

app.use(express.cookieParser());
app.use("/components", express.static("components"));

/* Dummy cookie auth */
app.get("/login", function(req, res) {
  res.cookie("loggedIn", "true");
  res.redirect("/");
});
app.get("/logout", function(req, res) { 
  res.cookie("loggedIn", "false");
  res.redirect("/");
});
app.use(function(req, res, next) {
  req.isAuthenticated = function() {
    return req.cookies.loggedIn === "true";
  }
  next();
});

app.use("/racer", require("racer-middleware")({
  db: require("livedb-mongo")("localhost:27017/test?auto_reconnect", {safe: true}),
  routes: {
    "blog": function(req, model, done) {
      model.set("_page.authorized", req.isAuthenticated());
      done();
    }
  },
  validation: function(shareRequest, cb) {
    cb(shareRequest.agent.req.isAuthenticated());
  }
}));

app.get("/require.js", function(req, res) {
  res.setHeader("Content-Type", "text/javascript");
  res.end(fs.readFileSync(path.resolve(__dirname, "../node_modules/requirejs/require.js"), "utf8"));
});

app.get("/polymer.js", function(req, res) {
  res.setHeader("Content-Type", "text/javascript");
  res.end(fs.readFileSync(path.resolve(__dirname, "../components/polymer/polymer.min.js"), "utf8"));
});

app.get("/racer-blog.html", function(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.end(fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8"));
});

app.get("/", function(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.end(fs.readFileSync(path.resolve(__dirname + "/index.html"), "utf8"));
});

app.listen(3000);