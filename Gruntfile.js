require('sjljs');

var fs = require('fs'),
    path = require('path');

module.exports = function (grunt) {

    var config = {
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            build: {
                src: [
                    'distro/js/<%= pkg.name %>.js'
                ],
                dest: 'distro/js/<%= pkg.name %>.min.js'
            }
        },
        copy: {
            js: {
                expand: true,
                src: 'src/js/*',
                dest: 'distro/js/',
                flatten: true,
                filter: 'isFile'
            }
        },
        concat: {
            debug: {
                src: [
                    'src/js/jquery.juiBase.js',
                    'src/js/jquery.juiMouse.js',
                    'src/js/jquery.juiAbstractPaginator.js',
                    'src/js/jquery.juiBasicPaginator.js',
                    'src/js/jquery.juiPaginatorWithTextField.js',
                    'src/js/jquery.juiScrollPane.js',
                    'src/js/jquery.juiDialog.js',
                    'src/js/jquery.juiScalableBtn.js',
                    'src/js/jquery.juiScrollableDropDown.js',
                    'src/js/jquery.juiSelectPicker.js'
                ],
                dest: 'distro/js/<%= pkg.name %>.js'
            }
        },
        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        cssmin: {
            'distro/css/jui-commons.min.css': 'distro/css/jui-commons.css'
        },
        watch: {
            compass: {
                files: ['./src/sass/**/*.scss'],
                tasks: ['compass'],
                options: {
                    spawn: false
                }
            },
            js: {
                files: ['./src/js/**/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                    livereload: 3000
                }
            }
        },
        jsdoc : {
            dist : {
                src: ['src/*'],
                options: {
                    destination: 'jsdocs',
                    recurse: true
                }
            }
        }
    };

    // Prepare uniminified target
    config.uglify.unminified = {};

    // Loop through files in js source and add copy and uglify configurations for them
    fs.readdirSync(__dirname + '/src/js').forEach(function (file) {
        // Add copy target for file
        config.copy[sjl.camelCase(file)] = {
            src: 'src/js/' + file,
            dest: 'distro/js/' + file
        };

        // Add unimified file target
        config.uglify.unminified['distro/js/' + path.basename(file, '.js') + '.min.js'] =
            ['src/js/' +  file.toString()];
    });

    //console.log(config.uglify, config.copy);

    // Project configuration.
    grunt.initConfig(config);

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Load the plugin that provides the "jsdoc" task.
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('default', [
        'compass',
        'cssmin',
        'copy',
        'concat',
        'uglify',
        'watch'
    ]);


};
