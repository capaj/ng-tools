module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-karma');

	grunt.initConfig({
		pkg: grunt.file.readJSON('bower.json'),
//		watch: {
//		},
		karma: {
			unit: {
				configFile: './test/karma.conf.js'
			},
			continous: {
				configFile: './test/karma.conf.js',
				singleRun: false
			}
		},
        connect: {
            test: {
                options: {
                    port: 9010,
                    livereload: 9012,
//                    base: 'test',
                    keepalive: true
                }
            }
        },
		concat: {
            options: {
                banner: '//<%= pkg.name %> version <%= pkg.version %> \n'
            },
			dist: {
				src: ['./src/module.js', './src/*.js'],
				dest: './dist/<%= pkg.name %>.js'
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				require: true,
				define: true,
				requirejs: true,
				describe: true,
				expect: true,
				it: true
			},
			all: [
				'Gruntfile.js'
			]
		},
		ngAnnotate: {
			all: {
				files: [
					{
						expand: true,
						src: ['dist/ng-tools.js'],
						rename: function (dest, src) { return src.split('.js')[0] + '.annotated.js'; }
					}
				]
			}
		},
		uglify: {
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.annotated.js'
				}
			}
		}
	});


	/// future
	grunt.registerTask('compile', [
		'concat',
		'ngAnnotate',
		'uglify'
	]);

	grunt.registerTask('default', [
		'compile'
	]);
};
