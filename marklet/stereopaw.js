console.log("[stereopaw 2.0]");

/*
 * SB: 'main' driver
 *
*/

var SB = (function () {

    var self = null,
    _interval = null,
    _sbjq = null,
    service = '';

    var sb = {

	init: function() {
	    self = this

	    self.Util.load_jQuery()

	    _interval = setInterval(function() {
		/*still need to do something about actually 
		  loading jQuery and noConflict
		*/
		if (typeof jQuery == "undefined")
		{
		    return false;
		}
		else
		{
		    clearInterval(_interval);
		    self.start()
		}

	    }, 150)

	},

	start: function () {

	    console.log("[stereopaw 2.0] start()");

	    /*determine service*/
	    self.service = self.Service.getService();
	    console.log( "Service: " + self.service )

	    /*build page shell*/
	    if ( !document.getElementById('sb-app') )
	    {
		self.Page.insert_page()
		self.events()	
	    }

	    /* enter update loop*/
	    self.update()

	},
	events: function() {

	    /*
	     * attach event handlers
	     */

	    console.log("[stereopaw 2.0] events()");

	    /*Exit 'X' click*/
	    $('#sb-close').bind("click", function() {
		console.log("[stereopaw 2.0] Exiting");

		clearInterval(self._interval)

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
		 window.open(self.Track.getURL(), 'stereopaw', 'top=0,left=0,width=600, height=500');
		 console.log("clicked")
		 $('#sb-close').click();
		 console.log("closing")
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
		console.log("seek");

		var offset = $(this).parent().offset();
		var x = e.pageX - offset.left;

		self.Data.seek( x / $('#sb-display-bar').width() )
	    });
	  
	},

	update: function() 
	{
	    console.log("[stereopaw 2.0] update()");

	    self._interval = setInterval(function() {

		/*get track information*/
		self.Data.setTrack(self.service, self.Track)

		//need error handling on empty track (not started plaing, etc)


		self.render()		
	    }, 300)

	},

	render: function() 
	{
	    console.log("[stereopaw 2.0] render()");
	    if ( $('#sb-app').is(":hidden") ) {
		$('#sb-app').fadeIn();
	    }

	    /*track data & time*/
	    if (!self.Track.getTitle() ) {
		document.getElementById('sb-track-title-label').style.display = "none";
	    }

	    document.getElementById('sb-track-title').innerHTML = self.Track.getTitle()

	    if (!self.Track.getArtist() ) {
		document.getElementById('sb-track-artist-label').style.display='none';
	    }

	    document.getElementById('sb-track-artist').innerHTML = self.Track.getArtist()

//	    document.getElementById('sb-track-service').innerHTML = self.service

	    if (!self.Track.getTimeFormat() ) {
		document.getElementById('sb-track-time-label').style.display='none';
	    }

	    document.getElementById('sb-time').innerHTML = self.Track.getTimeFormat()

	    /*render elapsed time bar*/
	    document.getElementById('sb-display-bar-elapsed').setAttribute('style', 'width: ' + self.Track.getElapsed() * 100 + '%;');


	}

    };

    return sb;

}() );
