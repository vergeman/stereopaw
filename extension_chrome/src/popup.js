
/*render logic*/
function render_loading() {
    // @ifdef DEBUG
    console.log("render_loading()")
    // @endif

    $('#sb-error').hide()
    $('#sb-track').hide()
    $('#sb-submit').hide()
    $('#sb-sleep').hide()

    $('#sb-loading').show()
    $('#sb-app').show()
}

function render_sleep() {
    // @ifdef DEBUG
    console.log("render_sleep()")
    // @endif

    $('#sb-error').hide()
    $('#sb-track').hide()
    $('#sb-submit').hide()
    $('#sb-loading').hide()
    
    $('#sb-sleep').show()
    $('#sb-app').show()
}

function render_no_service() {
    // @ifdef DEBUG
    console.log("render_no_service()")
    // @endif

    $('#sb-loading').hide()
    $('#sb-track').hide()
    $('#sb-submit').hide()
    $('#sb-sleep').hide()

    $('#sb-error').show()
    $('#sb-app').show()   
}

function render_active() {
    // @ifdef DEBUG
    console.log("render_active()")
    // @endif

    $('#sb-loading').hide()
    $('#sb-error').hide()
    $('#sb-sleep').hide()    

    $('#sb-track').show()
    $('#sb-submit').show()
    $('#sb-app').show()
}

function bind_buttons() {

    /*bind close*/
    $('#sb-close').bind("click", function() {
	// @ifdef DEBUG
	console.log("[stereopaw 2.0] extension Exit");
	// @endif

	window.close()
    });

    /*bind submit*/
    //url is global for now - trouble with getting updated values
    $('#sb-submit-button').click(function(e) {
	e.preventDefault();
	window.open(url, 'stereopaw', 'top=0,left=0,width=600, height=675')	
	$('#sb-close').click();
    });
}


/*
  General setup of popup
  1. run() - find any service matching tabs, and detect if
they're playing (detect_play)
  2. detect_play - each potential service, we inject testing code
to see if it's active. If active, it sends a chrome.extension
message saying the page is launchable
  3. A listener waits for a launchable message, and injects
the "marklet" code that will parse track data.
    3a: marklet will loop and send a track object to extension

  4. A listener for track object renders the track data*
/



/*detect if playing-by-service function
 *we'll focus only on first tab
 *returns true/false
 */
function detect_play(service, tab) {
    // @ifdef DEBUG
    console.log("detect_play()")
    // @endif

    if (!tab)
	return false

    var tab_id = tab.id;

    var insert = function(args) {
	var service = args[0]
	var extension_id = args[1]

	/*service specific "is-playing" detect logic
	 *context is service page
	 */
	var is_playing = {

	    soundcloud: function(args){
		//@ifdef DEBUG
		console.log("isplaying - soundcloud")
		//@endif

		var _extension_id = args[0]
		var result = false;

		var sc_mgr = require("lib/play-manager")

		try {
		    result = sc_mgr.getCurrentMetadata().sound.audio._isPlaying
		}
		catch(e) {}
		
		//@ifdef DEBUG
		console.log("sending message: launchable - " + result)
		//@endif

		chrome.runtime.sendMessage(_extension_id, 
					   {
					       launchable: result
					   })
	    },

	    youtube: function(args){
		//@ifdef DEBUG
		console.log("isplaying - youtube")
		//@endif

		var _extension_id = args[0]
		var result = false;

		try {
		    var _player = document.getElementById("movie_player")
		    var _state = _player.getPlayerState()
		    if (_state == 1)
			result = true
		}
		catch(e) {}

		chrome.runtime.sendMessage(_extension_id,
					   {
					       launchable: result
					   })
	    },

	    mixcloud: function(args){
		//@ifdef DEBUG
		console.log("isplaying - mixcloud")
		//@endif

		var _extension_id = args[0]
		var result = false;

		try {
		    var mc = $('.player').scope()
		    var result = mc.playerStarted
		}
		catch(e) {}

		chrome.runtime.sendMessage(_extension_id,
					   {
					       launchable: result
					   })
	    },

	    spotify: function(args){
		//@ifdef DEBUG
		console.log("isplaying - spotify")
		//@endif

		var _extension_id = args[0]
		var result = false;

		try {
		    var result = window.frames[1].document.getElementById('track-name').children[0].href.match(/track\/(.*)/)[1]
		}
		catch(e){}

		chrome.runtime.sendMessage(_extension_id,
					   {
					       launchable: result
					   })

	    },


	}

	/*inject*/
	var script = document.createElement('script');
	script.textContent = "(" + is_playing[service] + ")(" + JSON.stringify([extension_id]) + ");"
	document.head.appendChild(script)
	script.parentNode.removeChild(script)

    }

    /*build code obj for insert*/
    var code_obj = {
	code: "(" + insert + ")(" + JSON.stringify([service, chrome.runtime.id]) + ");"
    }

    /*insert into dom*/
    chrome.tabs.executeScript(tab_id, code_obj);

    return true
}


/*INJECTS MARKLET CODE
 *responsible for injecting track grabber and sending
 *a msg with track data to extension
 *
 *LAUNCHED - toggle to prevent multiple injections, take
 *only first match
*/
var LAUNCHED = false
chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {

	if (request.launchable && !LAUNCHED) {
	    //@ifdef DEBUG
	    console.log("RECEIVED LAUNCH MSG")
	    //@endif

	    LAUNCHED = true

	    chrome.tabs.executeScript(sender.tab.id, 
				      { code: "(function(){document.getElementById('sb-app') ? false : (function() {var e = document.createElement('script');e.setAttribute('id', 'sb-script');e.setAttribute('mode', 'extension');e.setAttribute('src','/* @echo HOST *//stereopaw-min.js?r='+Math.random()*99999999);document.body.appendChild(e)})() }())"
				      });
	}

	/*render services detected but possibly paused*/
	if (!request.launchable && !LAUNCHED) {
	    LAUNCHED = true
	    //@ifdef DEBUG
	    console.log("sleep")
	    //@endif

	    bind_buttons()

	    render_sleep()
	}
    }
)


/*cycle through music tabs and call detect_play() */
//chrome.browserAction.onClicked.addListener(function(tab) {
var run = function() {

    render_loading()

    var results = [];

    var urls = {
	soundcloud: "*://*.soundcloud.com/*",
	mixcloud: "*://*.mixcloud.com/*",
	youtube: "*://*.youtube.com/*",
	spotify: "*://*.spotify.com/*"
    }


    var check_detect = function(i) {
	//last iteration, and no detection
	if (i == Object.keys(urls).length-1) {

	    if (results.length == 0) {

		//@ifdef DEBUG
		console.log("nothing detected")
		//@endif

		bind_buttons()

		render_no_service()
	    }
	}
    }


    /*finds any pages with supported services
     *note: querytabs is async, so action in the callback
     */
    var i = 0;
    for (var url in urls) {

	//@ifdef DEBUG
	console.log(url)
	//@endif

	var find_tabs = function(url) {
	    chrome.tabs.query(
		{
		    url: urls[url]
		},
		//callback
		function(tabs) {

		    //@ifdef DEBUG
		    console.log("TAB")
		    console.log(tabs)
		    //@endif

		    //array of matches (can be multiple)
		    for (var tab in tabs) {
			results.push( detect_play(url, tabs[tab]) )
		    }

		    check_detect(i)

		    i=i+1;
		}
	    )
	}(url)
    }
}



/*
 *RENDER
 *sets up popup page (binds, etc) and renders track message
 */
/*receives track info from site*/
var PAGE_INSERTED = false;

/*url: keep it outside of listener so we can retrieve the most
* uptodate value for request.track.url
*/
var url;

chrome.runtime.onMessageExternal.addListener(

    function(request, sender, sendResponse) {
	//@ifdef DEBUG
	console.log("RECV EXTENSION")
	//@endif

	/*Bind events - close/submit*/
	if (request.track && !PAGE_INSERTED) {

	    //@ifdef DEBUG
	    console.log("Inserting Page")
	    //@endif

	    PAGE_INSERTED=true

	    bind_buttons()

	    render_active()
	}


	if (request.track) {
	    $('#sb-track').show()

	    /*
	     *RENDER TRACK INFO
	     */

	    //title
	    if (request.track.title) {
		document.getElementById('sb-track-title').innerHTML = request.track.title
	    } else {
		document.getElementById('sb-track-title').innerHTML = ''
		$('#sb-track-title-label').hide()
	    }

	    //artist
	    if (request.track.artist) {
		document.getElementById('sb-track-artist').innerHTML = request.track.artist
	    } else {
		document.getElementById('sb-track-artist').innerHTML =''
		$('#sb-track-artist-label').hide()
	    }

	    //timeformat
	    document.getElementById('sb-time').innerHTML = request.track.timeformat

	    //url
	    url = request.track.url


	} //end request.track

    }//end function(req, sender, sendResp  )
)

//used to notify popup shutdown in bg.js
chrome.extension.connect()
run();
