module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! ' +
                    '<%= pkg.name %> ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
//                beautify: {
//                    beautify: true,
//                    width: 72
//                }
            },
            build: {
                src: [
                    'src/js/jquery.juiBase.js',
                    'src/js/utils/*.js',
                    'src/js/ui/*.js'
                ],
                dest: 'distro/<%= pkg.name %>.min.js'
            },
            dev: {
                src: [
                    'src/js/jquery.juiBase.js',
                    'src/js/utils/*.js',
                    'src/js/ui/*.js'
                ],
                dest: 'distro/<%= pkg.name %>.js',
                options: {
                    beautify: {
                        beautify: true,
                        width: 72
                    }
                }
            }
        },
        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
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
                tasks: ['uglify'],
                options: {
                    spawn: false
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
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Load the plugin that provides the "jsdoc" task.
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('default', [
        'compass', 'uglify', 'jsdoc', 'connect', 'watch']);

    // Build task
    grunt.registerTask('build', [
        'compass', 'uglify', 'jsdoc']);

    // Development task
    grunt.registerTask('develop', [
        'compass', 'uglify', 'connect', 'watch']);

};