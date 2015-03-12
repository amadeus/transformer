// jshint node:true
module.exports = function(grunt) {

var build, deps, name, nameParts, pkg, test;

nameParts = __dirname.split('/');
name = nameParts[nameParts.length - 1];
pkg = grunt.file.readJSON('package.json');
deps = grunt.util._.keys(pkg.dependencies);
build = ['concat', 'regex-replace', 'uglify'];
test = ['coffee:test'];

[
	'grunt-contrib-coffee',
	'grunt-contrib-concat',
	'grunt-contrib-watch',
	'grunt-contrib-uglify',
	'grunt-regex-replace'
].forEach(grunt.loadNpmTasks);

grunt.config.init({
	pkg: pkg,
	coffee: {
		test: {
			files: {
				'test/test.js': 'test/test.coffee.md'
			}
		}
	},
	uglify: {
		options: {
			mangle: {
				toplevel: true
			},
			compress: {
				dead_code: true,
				unused: true,
				join_vars: true
			},
			comments: false
		},
		standalone: {
			files: {
				'dist/<%= pkg.name %>.standalone.min.js': ['dist/<%= pkg.name %>.standalone.js'],
				'dist/<%= pkg.name %>.min.js': ['src/<%= pkg.name %>.js']
			}
		}
	},
	concat: {
		standard: {
			src: 'src/<%= pkg.name %>.js',
			dest: 'dist/<%= pkg.name %>.js'
		},
		standalone: {
			src: [
				'node_modules/matrix-utilities/matrix-utilities.js',
				'node_modules/transform-to-matrix/transform-to-matrix.js',
				'node_modules/umodel/umodel.js',
				'dist/<%= pkg.name %>.js'
			],
			dest: 'dist/<%= pkg.name %>.standalone.js'
		}
	},
	'regex-replace': {
		min: {
			src: ['dist/<%= pkg.name %>.min.js', 'dist/<%= pkg.name %>.standalone.min.js'],
			actions: [
				{
					name: 'remove debug checks',
					search: '////DEV(.+)////END DEV',
					replace: '',
					flags: 'gim'
				}
			]
		}
	},
	watch: {
		test: {
			files: './test/*',
			tasks: test,
			options: {
				interrupt: true,
				spawn: false
			}
		}
	}
});

grunt.registerTask('default', build);

return grunt.registerTask('test', test);

};
