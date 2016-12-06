module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
        dest: 'js/bundles/classes.js',
      },
      engine: {
        src: ['js/screens/*.js', 'js/engine.js'],
        dest: 'js/bundles/engine.js',
      }

    },
    uglify: {
      engine: {
        options: {
          sourceMap: true,
        },
        files: {
          'js/bundles/script.min.js' : ['js/bundles/classes.js', 'js/bundles/engine.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['js/*/*.js', 'js/*.js', 'js/*/*/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
          spawn: false,
        },
      },
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks("grunt-contrib-uglify")
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

};
