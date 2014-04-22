module.exports = function(grunt){
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('assemble'); // Not grunt- prefixed.

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: 'app/scripts/{,*/}*.coffee',
                tasks: ['coffee']
            },
            styles: {
                files: 'app/styles/{,*/}*.scss',
                tasks: ['compass']
            },
            bower: {
                files: 'bower.json',
                tasks: ['bowerInstall']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            assemble: {
                files: ['app/templates/{partials,pages,layouts}/{,*/}*.{md,hbs,yml}'],
                tasks: ['assemble']
            },
            files: {
                files: ['app/images/{,*/}*.*']
            },
            options: {
                livereload: true 
            }
        },
        bowerInstall: {
            default: {
                src: ['.tmp/*.html', 'app/styles/{,*/}*.scss'],
            }
        },
        clean: {
            default: ['.tmp'],
            build: ['dist']
        },
        imagemin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '.tmp/',
                    src: 'images/{,*/}*.{png,jpg,gif}',
                    dest: '.tmp/'
                }]
            }
        },
        copy: {
            default: {
                expand: true,
                cwd: 'app',
                src: ['images/{,*/}*'],
                dest: '.tmp'
            },
            build: {
                expand: true,
                cwd: '.tmp',
                src: ['*.html', 'images/{,*/}*'],
                dest: 'dist/'
            }
        },
        htmlmin: {
            build: {
                options: {
                    collapseWhitespace: true,
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: '*.html',
                    dest: 'dist/'
                }]
            }
        },
        rev: {
            build: {
                files: {
                    src: [
                          'dist/scripts/{,*/}*.js',
                          'dist/styles/{,*/}*.css',
                          'dist/images/{,*/}*.*',
                          'dist/styles/fonts/{,*/}*',
                          'dist/*.{ico,png}'
                         ]
                }
            }
        },
        useminPrepare: {
            build: {
                expand: true,
                cwd: '.tmp/',
                src: ['*.html'],
                dest: 'dist/'
            }
        },
        usemin: {
            options: {
                assetsDirs: ['dist', 'dist/images']
            },
            html: ['dist/*.html'],
            css: ['dist/styles/{,*/}*.css']
        },
        coffee: {
            default: {
                files: [{
                    expand: true,
                    cwd: 'app/scripts',
                    dest: '.tmp/scripts',
                    src: '{,*/}*.{coffee,litcoffee,coffee.md}',
                    ext: '.js'
                }]
            }
        },
        compass: {
            default: {
                options: {
                    require: [],
                    sassDir: 'app/styles',
                    cssDir: '.tmp/styles',
                    importPath: 'bower_components'
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            default: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/',
                }]
            }
        },

        assemble: {
            options: {
                flatten: true,
                layout: 'app/templates/layouts/default.hbs',
                partials: ['app/templates/partials/{,*/}*.hbs'],
            },
            default: {
                files: {
                    '.tmp/': ['app/templates/pages/{,*/}*.hbs']
                }
            }
        },
        connect: {
            options: {
                open: true,
            },
            serve: {
                options: {
                    livereload: true,
                    base: '.tmp',
                }
            }
        }
    });

    grunt.registerTask('default', ['clean', 'coffee', 'compass', 'autoprefixer', 'assemble', 'bowerInstall', 'copy']);
    grunt.registerTask('serve', ['default', 'connect', 'watch']);
    grunt.registerTask('build', ['default', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'imagemin', 'rev', 'copy', 'usemin', 'htmlmin']);
};
