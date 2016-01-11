module.exports = function (grunt) {
  'use strict';

  require('jit-grunt')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      core: {
        options: {
          outputSourceFiles: true,
          sourceMap: true,
          sourceMapFilename: 'public/assets/app/css/style.css.map',
          sourceMapURL: 'style.css.map',
          strictMath: true
        },
        files: {
          'public/assets/app/css/style.css': 'less/style.less'
        }
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')
        ]
      },
      core: {
        src: 'public/assets/app/css/*.css'
      }
    },
    csscomb: {
      options: {
        config: 'less/.csscomb.json'
      },
      core: {
        src: 'public/assets/app/css/style.css',
        dest: 'public/assets/app/css/style.css'
      }
    },
    csslint: {
      options: {
        csslintrc: 'less/.csslintrc'
      },
      core: {
        src: 'public/assets/app/css/style.css'
      }
    },
    cssmin: {
      options: {
        advanced: false,
        keepSpecialComments: '*',
        sourceMap: true
      },
      core: {
        expand: true,
        cwd: 'public/assets/app/css',
        src: ['*.css', '!*.min.css'],
        dest: 'public/assets/app/css',
        ext: '.min.css'
      }
    },
    eslint: {
      options: {
        configFile: 'js/.eslintrc'
      },
      target: 'js/*.js'
    },
    jscs: {
      options: {
        config: 'js/.jscsrc'
      },
      grunt: {
        src: 'Gruntfile.js'
      },
      core: {
        src: 'js/*.js'
      }
    },
    concat: {
      core: {
        src: [
          'js/main.js'
        ],
        dest: 'public/assets/app/js/application.js'
      }
    },
    uglify: {
      options: {
        compress: {
          warnings: false
        },
        preserveComments: 'some'
      },
      core: {
        src: '<%= concat.core.dest %>',
        dest: 'public/assets/app/js/application.min.js'
      }
    },
    copy: {
      assets: {
        expand: true,
        src: 'assets/**',
        dest: 'public'
      },
      packages: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/bootstrap/dist',
            src: '**',
            dest: 'public/assets/vendor/bootstrap'
          },
          {
            expand: true,
            cwd: 'node_modules/jquery/dist',
            src: '*',
            dest: 'public/assets/vendor/jquery'
          }
        ]
      }
    },
    watch: {
      configFiles: {
        options: {
          reload: true
        },
        files: ['Gruntfile.js', 'package.json']
      },
      assets: {
        files: 'assets/**',
        tasks: 'copy:assets'
      },
      js: {
        files: 'js/*.js',
        tasks: 'js'
      },
      less: {
        files: 'less/**/*.less',
        tasks: 'css'
      }
    },
    clean: {
      assets: 'public/assets'
    }
  });

  grunt.registerTask('assets', 'copy');
  grunt.registerTask('css', ['less', 'postcss', 'csscomb', 'csslint', 'cssmin']);
  grunt.registerTask('js', ['eslint', 'jscs', 'concat', 'uglify']);
  grunt.registerTask('build', ['assets', 'css', 'js']);
  grunt.registerTask('test', ['clean', 'build']);
  grunt.registerTask('default', 'build');
};
