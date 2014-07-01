/* Deploy configuration for dev and production modes 
   Build:
   'grunt' for dev
   'grunt prod' for production mode
   to install node packages:
   npm install --save-dev
*/
module.exports = function(grunt) {

    grunt.initConfig({

	pkg: grunt.file.readJSON('package.json'),

	env: {
	    dev : {
		src : '.env.dev.json'
	    },

	    prod : {
		src: '.env.prod.json'
	    }
	},

	copy: {

	    assets: {
		expand: true,
		flatten: true,
		src: ['src/*.png', 'src/*.css'],
		dest: 'bin/'
	    },
	    libs: {
		expand: true,
		flatten: true,
		src: ['src/manifest.json', 'src/jquery.min.js'],
		dest: 'bin/'
	    }
	},

	preprocess : {	  
	    multifile : {
		files : {
		    "bin/manifest.json" : "src/manifest.json.js",
		    "bin/bg.js" : "src/bg.js",
		    "bin/content.js" : "src/content.js",
		    "bin/popup.js" : "src/popup.js",
		    "bin/popup.html" : "src/popup.html"
		}
	    },
	    
	},

	uglify: {
	    build: {
		files :[{
		    expand: true,
		    cwd: 'bin',
		    src: '*.js',
		    dest: 'bin'
		}]
	    }
	}

    });
    
    //load tasks
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //default task is dev mode.
    grunt.registerTask('default', ['env:dev', 'copy', 'preprocess']);
    grunt.registerTask('prod', ['env:prod', 'copy', 'preprocess', 'uglify']);

};
