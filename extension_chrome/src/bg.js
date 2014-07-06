//DEBUG=true
/*
insert google analytics code
http://developer.chrome.com/extensions/tut_analytics.html
*/

//onclick action
//analytics track event
//alert & append code


/*
 *listens to responses from extension post-play:
 *remove externally launched tab, and launches player:next on stereopaw

chrome.runtime.onMessageExternal.addListener(

    function(request, sender, sendResponse) {

	if (request.removetab) {
	    chrome.tabs.remove(request.removetab)

	    //we're in extension context, so we append to dom our js code
	    chrome.tabs.executeScript(request.stereopawtab, 
				      { 
					  code: "var e = document.createElement('script');e.setAttribute('type','text/javascript');e.textContent = \"(function(){ app.vent.trigger('Player:next')} ())\"; document.body.appendChild(e);"
				      });
	}
    }
)
*/

/*
 * how we control playback on a 3rd party site
 * with injected code
 */
chrome.runtime.onMessageExternal.addListener(

    function(request, sender, sendResponse) {
	//@ifdef DEBUG
	console.log("SERVICE")
	//@endif

	if (request.URL) {

	    var service = request.service
	    var timestamp = request.time
	    var url = request.URL	    
	    var stereopaw_tab = sender.tab

	    /*
	     * code here executes on service's (mixcloud/spotify,etc)
	     * page not extensions
	     */
	    var insert = function(args) {
		var _service = args[0]
		var _time = args[1]
		var _tab_id = args[2]
		var _stereopawtab_id = args[3]

		/*
		 * MIXCLOUD
		 */
		var mixcloud  = '(' + function(args) {
		    var time = args[0]
		    var mixcloudtab_id = args[1]
		    var stereopawtab_id = args[2]

		    x = $('.player').scope()
		    x.volume = 0;

		    if (!x.playerStarted && !x.playing) {
			x.volume=0;
			$('.cloudcast-play').click()
		    }

		    var checkExist = setInterval(function() {
			x.volume = 0;

			if (x.playerStarted && 
			    x.playing && 
			    !x.loading) {

			    x.$apply(function() { 
				x.$emit("slider:stop", time / 1000)
				x.volume=1
			    })

			    clearInterval(checkExist);
			}

		    }, 100);


/*
 * gives us uninterrupted play

		    var checkEnd = setInterval(function() {
			if (x.playerStarted && x.playing && !x.loading) {

			    if (x.audioPosition >= x.audioLength - 1) {
			        var extensionID = chrome.runtime.id;

				$(window).unbind("beforeunload")
				chrome.runtime.sendMessage(extensionID, {removetab: mixcloudtab_id,
									 stereopawtab: stereopawtab_id})
			    }
			}

		    }, 300);
*/
		} + ')(' + JSON.stringify([_time, _tab_id, _stereopawtab_id]) + ')'


		/*
		 *SPOTIFY
		 */

		var spotify  = '(' + function(args) {
		    var _self = this;
		    var _models;
		    var time = args[0]
		    var spotifytab_id = args[1]
		    var stereopawtab_id = args[2]


		    var loadmodels = function() {
		    	window.frames[1].require('$api/models', 
						 function(models) { 
						     _models = models 
						 }
						)
			return _models
		    }


		    var checkExist = setInterval(function() {

			if (window.frames[1] && 
			    window.frames[1].require) {

		    	    window.frames[1].require(['$api/models'], 
						     function(models)
						     { 

							 player = models.player
							 models.player.load("track").done(function(track) {

							     /*
							       this is so ugly
							       things aren't loading properly and many calls don't respond
							       some strange asynchronicity happening, but can't figure out what.
							     */
							     if (player.track && player.track.number && player.track.album
								 && ( player.track.uri.contains("spotify:track") || 
								      player.track.uri.contains("spotify:album"))
								) {								 

								 clearInterval(checkExist)

								 _album = player.track.album
								 _number = player.track.number

								 //initial play at timestamp
								 player.stop()

								 player.playContext(_album,
										    _number-1,
										    time)


								 //on end of track
								 var next = function() {

								     /*if we want the sequentail stereopaw play & close tab behavior 
								      *uncomment here and we don't need the rest.

								      var extensionID = chrome.runtime.id

								      chrome.runtime.sendMessage(extensionID, {removetab: spotifytab_id,
													      stereopawtab: stereopawtab_id})
								     */

								     //we close and move to next track
								     player.stop()

								     //we play next track in new context
								     player.playContext(_album,
											_number,
											0)
								 }

								 //we kill the old listener...by adding a listener.

								 var kill = function() {
								     player.removeEventListener('change:track', next)
								 }
								 
								 player.addEventListener('change:track', next)
								 player.addEventListener('change:track', kill)
							     }
							     
							 })//end model load

						     }
						    )//end window.frames[1]

			}

		    }, 500);


		} + ')(' + JSON.stringify([_time, _tab_id, _stereopawtab_id]) + ')'



		/*
		 *Add Services..
		 *where we build DOM element to insert code into service's page
		 */

		var script = document.createElement('script');

		if (_service == "mixcloud") {
		    script.textContent = mixcloud
		}

		if (_service == "spotify") {
		    script.textContent = spotify
		}


		if (_service == "another") {
		    script.textContent = "another"
		}


		(document.head||document.documentElement).appendChild(script);
		script.parentNode.removeChild(script);

	    } //end var=insert


	    /*Inject JS
	     *note: can't pass functions through JSON.stringfy
	     */

	    chrome.tabs.create({'url': url}, function(tab) {

		/* executes the insert code
		 * setup for "seamless" play with tab messaging, but hold off for now
		 * the behavior may be too confusing
		 */
		chrome.tabs.executeScript(null,
					  { 
					      code: "(" + insert + ")(" + JSON.stringify([service, timestamp, tab.id, stereopaw_tab.id]) + ");"
					  }
					 );
	    });


	    
	}//end if request.url
	
    }
);

/*
 *notify via shutdown message to marklet when popup is closed
 * on a connect = we have an open popup, so we listen for a disconnect
 * on a disconnect = we have closed the popup
 *   on a close, if there was nothing sent (i.e. audio pause, or no detected services) we never add msg listener,
 *     and just remove the port listener
 *   on a close, if track data is being sent, we add the msg_listener on MessageExternal event
 * this means one message must be received, (to trigger the msg_listener) and responded with a shutdown, and then we clean up
 */

var connect_listener = function(port) {
    //@ifdef DEBUG
    console.log("[Stereopaw BG] connect_listener: connected")
    //@endif

    var port_listener = function(event) {
	//@ifdef DEBUG
	console.log("[Stereopaw BG] port listener")
	//@endif

	/*when shutdown, 'intercept' by adding a new listener
	 *and tell it to shutup
	 */
	var msg_listener = function(request, sender, sendResponse) {
	    //@ifdef DEBUG
	    console.log("[Stereopaw BG] msg_listener")
	    //@endif

	    if (request.track) {
		//@ifdef DEBUG
		console.log("BG: sending shutdown response")
		//@endif

		sendResponse({shutdown:true})

		var kill = function() {
		    try {
			clearInterval(document.getElementById('sb-script').getAttribute('timer') )
			var e = document.getElementById("sb-script");
			e.parentNode.removeChild(e);
		    }
		    catch(e) {
			//@ifdef DEBUG
			//@endif
		    }
		}

		chrome.tabs.executeScript(sender.tab.id,
					  { 
					      code: "(" + kill+ ")();"
					  }
					 );


	    }
	    //@ifdef DEBUG
	    console.log("remove listener")
	    //@endif

	    chrome.runtime.onMessageExternal.removeListener(msg_listener)
	}

	/*
	 *we will receive one message before the listener gets removed
	 *enough to send a shutdown message, and then remove itself.
	 *all being triggered by an ondisconnect
	 */

	chrome.runtime.onMessageExternal.addListener(msg_listener)

	port.onDisconnect.removeListener(port_listener)
    }

    port.onDisconnect.addListener(port_listener);
}
chrome.extension.onConnect.addListener(connect_listener)



