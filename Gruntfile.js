module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! ' +
                    '<%= pkg.name %> ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            build: {
                src: [
                    'distro/<%= pkg.name %>.js'
                ],
                dest: 'distro/<%= pkg.name %>.min.js'
            }
        },
        concat: {
            debug: {
                src: [
                    'src/js/jquery.juiBase.js',
                    'src/js/ui/jquery.juiMouse.js',
                    'src/js/ui/jquery.juiAbstractPaginator.js',
                    'src/js/ui/jquery.juiBasicPaginator.js',
                    'src/js/ui/jquery.juiPaginatorWithTextField.js',
                    'src/js/ui/jquery.juiScrollPane.js',
                    'src/js/ui/jquery.juiDialog.js',
                    'src/js/ui/jquery.juiScalableBtn.js',
                    'src/js/ui/jquery.juiScrollableDropDown.js',
                    'src/js/ui/jquery.juiSelectPicker.js'
                ],
                dest: 'distro/<%= pkg.name %>.js'
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
            'distro/css/jui-commons.css': 'src/css/jui-commons/jui-commons.css'
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
        connect: {
            server: {
                options: {
                    port: 3000,
                    base: '.'
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.server.options.port %>/examples'
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
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');

    // Load the plugin that provides the "jsdoc" task.
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('default', [
        'compass',
        'cssmin',
        'concat',
        'uglify',
        'connect',
        'open',
        'watch'
    ]);

    // Build task
    grunt.registerTask('build', [
        'compass',
        'cssmin',
        'concat',
        'uglify',
    ]);

    // Development task
    grunt.registerTask('develop', [
        'compass',
        'cssmin',
        'connect',
        'open',
        'watch'
    ]);

};
