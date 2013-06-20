/*jshint node:true*/
module.exports = function (grunt) {
    'use strict';
    var browsers = [
            {
                browserName: 'firefox',
                version: '19',
                platform: 'XP'
            },
            {
                browserName: 'chrome',
                platform: 'XP'
            },
            {
                browserName: 'chrome',
                platform: 'linux'
            },
            {
                browserName: 'internet explorer',
                platform: 'WIN8',
                version: '10'
            },
            {
                browserName: 'internet explorer',
                platform: 'VISTA',
                version: '9'
            },
            {
                browserName: 'opera',
                platform: 'Windows 2008',
                version: '12'
            }
        ];
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                files: {
                    'dist/jquery.validate.js': ['jquery.validate.js'],
                    'dist/additional-methods.js': ['additional-methods.js']
                }
            }
        },
        uglify: {
            options: {
                preserveComments: false,
                banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("m/d/yyyy") %>\\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
            },
            all: {
                files: {
                    'dist/jquery.validate.min.js': ['dist/jquery.validate.js'],
                    'dist/additional-methods.min.js': ['dist/additional-methods.js']
                }
            }
        },
        zip: {
            dist: {
                src: [
                    'dist/additional-methods.js',
                    'dist/additional-methods.min.js',
                    'dist/jquery.validate.js',
                    'dist/jquery.validate.min.js',
                    'README.md',
                    'changelog.txt',
                    'grunt.js',
                    'package.json',
                    'demo/**/*.*',
                    'lib/**/*.*',
                    'localization/**/*.*',
                    'test/**/*.*'
                ],
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
            },
            options: { zlib: { level: 1 } }
        },
        qunit: { files: ['test/index.html', 'test/index2.html', 'test/index3.html', 'test/index4.html'] },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    $: true,
                    console: true
                }
            },
            files: [
                'jquery.validate.js',
                'additional-methods.js',
                'localization/*.js'
            ],
            test: {
                options: {
                    globals: {
                        jQuery: true,
                        $: true,
                        QUnit: true,
                        module: true,
                        test: true,
                        start: true,
                        stop: true,
                        expect: true,
                        ok: true,
                        equal: true,
                        deepEqual: true,
                        strictEqual: true
                    }
                },
                files: {
                    src: [
                        'test/test.js',
                        'test/rules.js',
                        'test/messages.js',
                        'test/methods.js'
                    ]
                }
            },
            grunt: { files: { src: ['Gruntfile.js'] } }
        },
        'saucelabs-qunit': {
            all: {
                options: {
                    urls: ['http://localhost:9999/test/index.html'],
                    username: 'osbdemo',
                    key: '3dca71b6-e473-4e30-b756-ec2dbfb95e82',
                    tunnelTimeout: 5,
                    build: require('process').env.TRAVIS_JOB_ID,
                    concurrency: 3,
                    browsers: browsers,
                    testname: 'javascript unit tests'
                }
            }
        },
        connect: {
            server: {
                options: {
                    base: '.',
                    port: 9999
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-zipstream');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.registerTask('sauce', [
        'connect',
        'saucelabs-qunit'
    ]);
    grunt.registerTask('default', [
        'jshint',
        'qunit',
        'sauce'
    ]);
    grunt.registerTask('release', [
        'default',
        'concat',
        'uglify',
        'zip'
    ]);
};
