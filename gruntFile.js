module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({
		pkg: grunt.file.readJSON('bower.json'),
//		watch: {
//			options: {
//				livereload: true
//			},
//			files: ['src/**/*.html'],
//			autocompile: {
//				files: ['src/**/*.js', '!src/bower_components'],
//				tasks: autocompileTasks
//			},
//			less: {
//				files: 'src/**/*.less',
//				tasks: ['less:development']
//			},
//			replace: {
//				files: 'src/resource/index.html',
//				tasks: ['replace:indexMain']
//			},
//			manifest: {
//				files: 'src/loadOrder.js',
//				tasks: ['smg']
//			},
//			JSfileAddedDeleted: {
//				files: 'src/js/**/*.js',
//				tasks: ['smg'],
//				options: {
//					event: ['added', 'deleted']
//				}
//			},
//			bower: {
//				files: 'bower.json',
//				tasks: ['clean']
//			}
//		},
		concat: {
			app: {
				src: ['./src/module.js', './src/*.js'],
				dest: './dist/<%= pkg.name %>-<%= pkg.version %>.js'
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
		uglify: {
			dist: {
				files: {
					'dist/<%= pkg.name %>-<%= pkg.version %>.min.js': 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
				}
			}
		}
	});


	/// future
	grunt.registerTask('compile', [
		'concat',
		'uglify'
	]);

	grunt.registerTask('default', [
		'compile'
	]);
};
