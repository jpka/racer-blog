module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      build: {
        src: ["components/*/index.html", "component.html"],
        dest: "index.html"
      }
    },
    watch: {
      build: {
        files: "<%= concat.build.src %>",
        tasks: ["build"]
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("karma", function() {
    require("child_process").spawn("node_modules/.bin/karma", ["start"], {stdio: "inherit"});
  });

  grunt.registerTask("build", ["concat:build"]);
  grunt.registerTask("test", ["build", "karma", "watch:build"]);
}
