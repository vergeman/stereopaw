//@ifdef DEBUG
console.log("[stereopaw 2.0]");
//@endif

HOST = "/* @echo HOST */"
EXTENSION_ID = "/* @echo EXTENSION_ID */"

/*
 * SB: 'main' driver
 *
*/
var MODE = { 
    MARKLET : 0,
    EXTENSION : 1
}

var SB = (function () {

    var self = null,
    _interval = null,
    _sbjq = null,
    service = '';

    var mode;

    var sb = {

	init: function() {
	    self = this

	    self.Util.load_jQuery()

	    _interval = setInterval(function() {
		/*still need to do something about actually 
		  loading jQuery and noConflict
		*/

		/*weird case*/
		if ($ == undefined && jQuery != null) {
		    $ = jQuery
		}

		if (typeof jQuery == "undefined")
		{
		    return false;
		}
		else
		{
		    clearInterval(_interval);
		    _interval = null
		    self.start()
		}

	    }, 150)

	},

	start: function () {

	    //@ifdef DEBUG
	    console.log("[stereopaw 2.0] start()");
	    //@endif

	    /*determine service*/
	    self.service = self.Service.getService();

	    //@ifdef DEBUG
	    console.log( "Service: " + self.service )
	    //@endif

	    /*determine mode: [extension, marklet]*/
	    if (window.chrome &&
		document.getElementById('sb-script').getAttribute('mode')
	       ) {
		mode = MODE.EXTENSION
	    }
	    else {
		mode = MODE.MARKLET
	    }
	    
	    //@ifdef DEBUG
	    console.log("mode: " + mode)
	    //@endif

	    /*build page if marklet mode*/
	    if (mode == MODE.MARKLET &&
		!document.getElementById('sb-app') )
	    {
		self.service == "NA" ? 
		    self.Page.insert_error_page() :
		    self.Page.insert_page()

		/*bind events*/
		self.events()
	    }
	
	    /* enter update loop*/
	    self.update()

	},

	events: function() {

	    /*
	     * attach event handlers
	     */

	    //@ifdef DEBUG
	    console.log("[stereopaw 2.0] events()");
	    //@endif

	    /*Exit 'X' click*/
	    $('#sb-close').bind("click", function() {

		//@ifdef DEBUG
		console.log("[stereopaw 2.0] Exiting");
		//@endif

		clearInterval(self._interval)
		self._interval = null

		$('#sb-submit-button').unbind('click');
		$('#sb-close').unbind('click')

		$('#sb-script').remove();
		$('#sb-style').remove();
		$('#sb-app').remove();
	    });

	    /*Form Submit -> Popup w/ organized metadata
	       TODO: pass metadata in url, pretty-printed
	     */
	     $('#sb-submit-button').bind("click", function(e) {
		 e.preventDefault();
		 window.open(self.Track.getURL(), 'stereopaw', 'top=0,left=0,width=600, height=675');

		 //@ifdef DEBUG
		 console.log("clicked")
		 //@endif

		 $('#sb-close').click();

		 //@ifdef DEBUG
		 console.log("closing")
		 //@endif
	     });

	    /*player controls*/
	    //pause/play
	    //seek
	    $('#sb-display-bar').mouseover(function(e) {
		$('#sb-display-seek').show();
	    });

	    $('#sb-display-bar').mouseout(function(e) {
		$('#sb-display-seek').hide();
	    });

	    $('#sb-display-bar').mousemove(function(e) {

		var offset = $(this).parent().offset();
		var x = e.pageX - offset.left;
		//var y = e.pageY - offset.top;

		$('#sb-display-seek').css("left", x + "px");
	    });

	    //track seek - serviceplayer unique
	    $('#sb-display-bar').click(function(e) {
		//@ifdef DEBUG
		console.log("seek");
		//@endif

		var offset = $(this).parent().offset();
		var x = e.pageX - offset.left;

		self.Data.seek( x / $('#sb-display-bar').width() )
	    });
	  
	},

	update: function() 
	{
	    //@ifdef DEBUG
	    console.log("[stereopaw 2.0] update()");
	    //@endif

	    self._interval = setInterval(function() {
		//@ifdef DEBUG
		console.log("[stereopaw 2.0] setInterval")
		//@endif

		/*get/set track information*/
		self.Data.setTrack(mode, self.service, self.Track)

		/*render accordingly*/
		if (mode == MODE.MARKLET) {
		//need error handling on empty track (not started plaing, etc)
		    self.render()
		}
		else {

		    self.sendExtension();
		}

	    }, 400)

	},

	/*
	 *loops and sends updated track information
	 *waits fora  shutdown message from bg.js
	 */
	sendExtension: function() {
	    //@ifdef DEBUG
	    console.log("[stereopaw 2.0] sendExtension()");
	    //@endif

	    var msg;

	    if (self.service == "NA") {
		msg = {error: true}
	    }
	    else {
		msg = {track: self.Track.toJSON()}
	    }

	    //@ifdef DEBUG
	    console.log(msg)
	    //@endif

	    /*response an 'intercept' from bg.js: 
	     *port.onDisconnect listener
	     */
	    var cb = function(response) {
		//@ifdef DEBUG
		console.log("cb")
		//@endif

		if (response.shutdown) {
		    //@ifdef DEBUG
		    console.log("Shutting down")
		    console.log(msg)
		    //@endif

		    /*clean up*/
		    $('#sb-script').remove()
		    clearInterval(SB._interval)
		    SB._interval = null
		}
	    }

	    //@ifdef DEBUG
	    console.log("stereopaw 2.0 sending msg")
	    //@endif

	    chrome.runtime.sendMessage(EXTENSION_ID, msg, cb)
	},

	render: function() 
	{
	    //@ifdef DEBUG
	    console.log("[stereopaw 2.0] render()");
	    //@endif

	    if ( $('#sb-app').is(":hidden") ) {
		$('#sb-app').fadeIn();
	    }

	    /* error */
	    if (self.service != "NA") {


		/*track data & time*/
		!self.Track.getTitle() ? 
		    document.getElementById('sb-track-title-label').style.display = 'none' : 
		    document.getElementById('sb-track-title').innerHTML = self.Track.getTitle()

		!self.Track.getArtist() ?
		    document.getElementById('sb-track-artist-label').style.display='none' : ""
 
		document.getElementById('sb-track-artist').innerHTML = self.Track.getArtist()

		//document.getElementById('sb-track-service').innerHTML = self.service

		!self.Track.getTimeFormat() ?
		    document.getElementById('sb-track-time-label').style.display='none' :
		    document.getElementById('sb-time').innerHTML = self.Track.getTimeFormat()

		/*render elapsed time bar*/
		//document.getElementById('sb-display-bar-elapsed').setAttribute('style', 'width: ' + self.Track.getElapsed() * 100 + '%;');


	    }
	}

    };

    return sb;

}() );
