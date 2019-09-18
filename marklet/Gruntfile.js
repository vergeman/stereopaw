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

	preprocess : {	  
	    multifile : {
		files : {
		    "bin/Data.js" : "src/Data.js",
		    "bin/Page.js" : "src/Page.js",
		    "bin/Run.js" : "src/Run.js",
		    "bin/Service.js" : "src/Service.js",
		    "bin/stereopaw.js" : "src/stereopaw.js",
		    "bin/Track.js" : "src/Track.js",
		    "bin/Util.js" : "src/Util.js"
		}
	    },
	    
	},

	concat: {
	    options: {
		separator: ';',
	    },
	    dist: {
		src: [
		    'bin/stereopaw.js',
		    'bin/Util.js',
		    'bin/Page.js',
		    'bin/Service.js',
		    'bin/Track.js',
		    'bin/Data.js',
		    'bin/Run.js'
		],
		dest: 'bin/stereopaw-build.js',
	    },
	},
	
	//built file is copied to rails app public dir
	uglify: {
	    build: {
		files :{
		    '../app/public/stereopaw-min.js' : ['bin/stereopaw-build.js']
		}
	    }
	},

	//ignore clean of *-build files in /bin
	clean: {
	    js: ["bin/*.js", "!bin/*-build.js"]
	}
    });
    
    //load tasks
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');


    //default task is dev mode.
    grunt.registerTask('default', ['env:dev', 'preprocess', 'concat', 'uglify', 'clean']);
    grunt.registerTask('prod', ['env:prod', 'preprocess', 'concat', 'uglify', 'clean']);

};
