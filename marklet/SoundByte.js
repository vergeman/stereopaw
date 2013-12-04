console.log("[SoundByte 2.0]");

/*
 * SB: 'main' driver
 *
*/

var SB = (function () {

    self = null,
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

	    console.log("[SoundByte 2.0] start()");

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

	    console.log("[SoundByte 2.0] events()");

	    /*Exit 'X' click*/
	    $('#sb-close').bind("click", function() {
		console.log("[SoundByte 2.0] Exiting");

		clearInterval(self._interval)

		$('sb-close').unbind('click')

		$('#sb-script').remove();
		$('#sb-style').remove();
		$('#sb-app').remove();
	    });

	    /*Form Submit -> Popup w/ organized metadata
	       TODO: pass metadata in url, pretty-printed
	     */
	     $('#sb-submit-button').bind("click", function(e) {
		 e.preventDefault();
		 window.open(self.Track.getURL(), 'SoundByte', 'top=0,left=0,width=600, height=500');
		 console.log("clicked")
	     });

	    /*player controls*/
	    //pause/play
	    //seek

	  
	},

	update: function() 
	{
	    console.log("[SoundByte 2.0] update()");

	    self._interval = setInterval(function() {

		/*get track information*/
		self.Data.setTrack(self.service, self.Track)

		//need error handling on empty track (not started plaing, etc)

		self.render()		
	    }, 300)

	},

	render: function() 
	{
	    console.log("[SoundByte 2.0] render()");
	    if ( $('#sb-app').is(":hidden") ) {
		$('#sb-app').fadeIn();
	    }

	    /*track data & time*/
	    document.getElementById('sb-track-title').innerHTML = self.Track.getTitle()
	    document.getElementById('sb-track-artist').innerHTML = self.Track.getArtist()
	    document.getElementById('sb-track-service').innerHTML = self.service
	    document.getElementById('sb-time').innerHTML = self.Track.getTimeFormat()

	    /*render elapsed time bar*/
	    document.getElementById('sb-display-bar-elapsed').setAttribute('style', 'width: ' + self.Track.getElapsed() * 100 + '%;');

	}

    };

    return sb;

}() );
