module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/jqfactory.js'],
      options: {
        globals: {
          jQuery: true,
          console: false,
          module: true,
          document: true
        },
        sub: true
      }
    },
    uglify: {
      my_target: {
        files: {
          'src/jqfactory.min.js': ['src/jqfactory.js']
        }
      },
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> \n' +
        '<%= pkg.homepage ? "* " + pkg.homepage : "" %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>*/\n'
      }
    },
  jasmine: {
    customRunner: {
      src: 'src/jqfactory.js',
      options: {
        specs: 'test/spec/jqfactorySpec.js',
        helpers: ['libs/jquery/jquery.js', 'libs/jasmine/jasmine-jquery.js']
      }
    }
  }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.registerTask('test', ['jshint', 'jasmine']);
  // Travis CI task.
  grunt.registerTask('travis', 'test');
  grunt.registerTask('build', ['uglify']);
  grunt.registerTask('default', ['test', 'build']);

};