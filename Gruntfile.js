module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ["dist"],
    concat: {
      classes: {
        src:
          [
            'js/classes/*.js',
            'js/classes/Enemies/Enemy.js',
            'js/classes/Enemies/AnimatedEnemy.js',
            'js/classes/Enemies/RedHorn.js',
            'js/classes/Enemies/YellowFlam.js'
          ],
        dest: 'dist/classes.js',
      },
      engine: {
        src: ['js/screens/*.js', 'js/engine.js'],
        dest: 'dist/engine.js',
      }

    },
    uglify: {
      engine: {
        options: {
          sourceMap: true,
        },
        files: {
          'dist/script.min.js': ['dist/classes.js', 'dist/engine.js']
        }
      }
    },
    copy: [
      { src: "index.html", dest: "dist/index.html" },
      { src: "css/**", dest: "dist/", expand: true },
      { src: "images/**", dest: "dist/", expand: true },
    ],
    watch: {
      scripts: {
        files: ['js/*/*.js', 'js/*.js', 'js/*/*/*.js'],
        tasks: ['clean', 'concat', 'uglify', 'copy'],
        options: {
          spawn: false,
        },
      },
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'concat', 'uglify', 'copy']);

};
