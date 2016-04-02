'use strict';

module.exports = function (grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  require('time-grunt')(grunt);


  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      continous: {
        autoWatch: true,
        singleRun: false
      },
      unit: {
        autoWatch: false,
        singleRun: true
      }
    },
    jscs: {
      src: 'app/scripts/**/*.js',
      options: {
        config: ".jscsrc",
        esnext: false,
        verbose: true,
        fix: false
      }
    },
    connect: {
      server: {
        options: {
          hostname: '0.0.0.0',
          base: 'app',
          port: 8080,
          livereload: true
        }
      }
    },
    wiredep: {
      app: {
        src: 'app/index.html'
      }
    },
    watch: {
      options: {
        livereload: true
      },
      target: {
        files: ['app/*.html', 'app/styles/**/*.css', 'app/scripts/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-wiredep');
  // Default task.
  grunt.registerTask('test', ['jscs', 'karma:unit']);
  grunt.registerTask('default', ['jscs', 'karma:unit', 'connect', 'wiredep', 'watch']);
};
