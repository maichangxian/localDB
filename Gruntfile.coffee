module.exports = (grunt) ->
    'use strict'

    convert = (name, path, contents) ->
        while true
            item = contents.match(/(.+) = require\('.+'\);/)
            break if not item?
            for k, v of item
                moduleName = v.trim() if k is "1"
                contents = contents.replace(new RegExp("(var.*) " + moduleName + ",?"), "$1")
                contents = contents.replace(/(var.*), *;/, "$1;")
            contents = contents.replace(/(.+) = require\('.+'\).*\n/, "")
        contents = contents.replace(/.*Generated by CoffeeScript.*\n/, "")
        contents = contents.replace(/return module.exports = (.*);\n/, "self.$1 = $1;")
        contents = contents.replace(/(.+) = require\(['"]$/, "")
        contents = contents.replace(/define\([^{]*?{/, "").replace(/\}\);[^}\w]*$/, "")
        contents = contents.replace(/define\(\[[^\]]+\]\)[\W\n]+$/, "")
        contents = "(function(self){\n" + contents
        contents += "\n})(this);\n"
        return contents


    require('load-grunt-tasks')(grunt)

    grunt.initConfig {
        pkg: grunt.file.readJSON 'package.json'
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
        karma: {
            unit: {
                configFile: 'karma.conf.coffee'
                singleRun: true
            }
        }
        clean: {
            build: ['dist/<%= pkg.version %>']
            # release: ['dist/*', '!dist/localdb{.,.min.}js']
        }
        requirejs: {
            ### r.js exmaple build file
             *  https://github.com/jrburke/r.js/blob/master/build/example.build.js
            ###
            compile: {
                options: {
                    name: "localdb"
                    # mainConfigFile: 'src/localdb.js'
                    baseUrl: "src/"
                    out: "dist/<%= pkg.version %>/localdb.js"
                    optimize: 'none'
                    # Include dependencies loaded with require
                    findNestedDependencies: true
                    # Avoid breaking semicolons inserted by r.js
                    skipSemiColonInsertion: true
                    wrap: {
                        startFile: "src/wrap.start"
                        endFile: "src/wrap.end"
                    }
                    onBuildWrite: convert
                }
            }
        }
        copy: {
            main: {
                files: {
                    "dist/<%= pkg.version %>/localdb-sea.js": ["dist/<%= pkg.version %>/localdb.js"]
                }
                options: {
                    process: (content, srcpath) -> "define(function(require, exports, module) {#{content}});"
                }
            }
        }
        uglify: {
            standalone: {
                files: {
                    "dist/<%= pkg.version %>/localdb.min.js": ["dist/<%= pkg.version %>/localdb.js"]
                }
                options: {
                    banner: '<%= banner %>'
                    preserveComments: false
                    sourceMap: true
                    sourceMapName: "dist/<%= pkg.version %>/localdb.min.map"
                    report: "min"
                    beautify: {
                        "ascii_only": true
                    }
                    compress: {
                        "hoist_funs": false
                        loops: false
                        unused: false
                    }
                }
            }
            sea: {
                files: {
                    "dist/<%= pkg.version %>/localdb-sea.min.js": ["dist/<%= pkg.version %>/localdb-sea.js"]
                }
                options: {
                    banner: '<%= banner %>'
                    preserveComments: false
                    sourceMap: true
                    sourceMapName: "dist/<%= pkg.version %>/localdb-sea.min.map"
                    report: "min"
                    beautify: {
                        "ascii_only": true
                    }
                    compress: {
                        "hoist_funs": false
                        loops: false
                        unused: false
                    }
                }
            }
        }
        coveralls: {
            options: {
                debug: true
                coverage_dir: 'coverage/'
                dryRun: if process.env.TRAVIS? then false else true
                force: true
                recursive: true
            }
        }
    }

    grunt.registerTask 'test', ['karma', 'coveralls']

    grunt.registerTask 'build', ['test', 'clean:build', 'requirejs', 'copy', 'uglify:*']

    grunt.registerTask 'default', ['test']

    return
























