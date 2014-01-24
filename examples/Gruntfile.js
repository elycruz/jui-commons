module.exports = function (grunt) {
    grunt.initConfig({

        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },

        cssmin: {
            './distro/css/examples.min.css': './distro/sass-compiled-css/examples.css'
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                './scripts/**/*.js'
            ]
        },

        requirejs: {
            distro: {
                options: {
                    baseUrl: './scripts',
                    optimize: 'uglify',
                    out: './distro/js/examples.min.js',
                    name: 'init',
                    mainConfigFile: './scripts/init.js',
//                    stubModules: ['text', 'hbs'],
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true
                }
            },
            debug: {
                options: {
                    baseUrl: 'scripts',
                    optimize: 'none',
                    out: 'distro/js/examples.js',
                    name: 'init',
                    mainConfigFile: 'scripts/init.js',
//                    stubModules: ['text', 'hbs'],
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true
                }
            }
        },

        watch: {
            compass: {
                files: ['./sass/**/*.scss'],
                tasks: ['compass'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            cssmin: {
                files: ['./distro/sass-compiled-css/**/*.css'],
                tasks: ['cssmin'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            js: {
                files: ['./scripts/**/*.js'],
                tasks: ['requirejs'],
                options: {
                    spawn: false,
                    livereload: true
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [
        'compass',
        'cssmin',
        'requirejs',
        'watch'
    ]);

    grunt.registerTask('develop', [
        'compass',
        'cssmin',
        'requirejs:debug',
        'watch'
    ]);

};
