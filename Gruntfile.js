module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
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
            'distro/css/jui-commons.min.css': 'src/css/jui-commons.css'
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
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Load the plugin that provides the "jsdoc" task.
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('default', [
        'compass',
        'cssmin',
        'concat',
        'uglify',
        //'connect',
        //'open',
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
        //'connect',
        //'open',
        'watch'
    ]);

};
