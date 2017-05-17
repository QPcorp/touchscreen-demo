//Gruntfiles.js
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			build: ['Grunfile.js', 'app/controllers/*.js', 'app/directives/*.js', 'app/filters/*.js', 'app/app.module.js', 'app/app.router.js', 'app/factories/*.js', 'app/services/*.js']
		},
		concat: {
			dist: {
				src: ['assets/libs/third-party/*.js'],
				dest: 'assets/libs/third-party/third-party-libraries.min.js'
				}
			},
		uglify: {
			options: {
				banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */',
				mangle:false
			},
			build: {
				files: {
					'app/controllers.min.js': 'app/controllers/*.js',
					'app/directives.min.js': 'app/directives/*.js',
					'app/filters.min.js': 'app/filters/*.js',
					'app/factories.min.js': 'app/factories/*.js',
					'app/services.min.js' : 'app/services/*.js'
				}
			}
		},
		cssmin: {
			options: {
				banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */'
				},
			build: {
				files: {
					'assets/css/styles.min.css': 'assets/css/styles.css'
				}
			}
		},
		sass: {
			dist: {
				files: {
				        'assets/css/styles.css': 'assets/css/sass/*.scss'      // 'destination': 'source'
				}
			}
		},
		watch: {
			css: {
				files: 'assets/css/sass/*.scss',
				tasks: ['sass','cssmin']
			},
		  	scripts: {
		    	files: ['app/controllers/*.js','app/directives/*.js', 'app/factories/*.js', 'app/filters/*.js', 'app/app.module.js','app/app.router.js', 'app/services/*.js'],
		    	tasks: ['jshint', 'uglify']
		  	}
		},
		nodemon: {
		  dev: {
		    script: 'server.js'
		  }
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.registerTask('default', ['jshint','concat','uglify','sass','cssmin','watch']);
};