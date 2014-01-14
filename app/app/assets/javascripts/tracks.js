var SBsound;

soundManager.setup({
    url: '/swf',
    flashVersion: 9, // optional: shiny features (default = 8)
    // optional: ignore Flash where possible, use 100% HTML5 mode
    preferFlash: false,
    onready: function() {
	// Ready to use; soundManager.createSound() etc. can now be called.
	$('.play').click(function() {
	    soundManager.destroySound('SBSound')

	    var track_id = $(this).attr('track_id')
	    var soundcloud_key = $('#soundcloud_key').attr('data');

	    SBsound = soundManager.createSound({
		id: 'SBSound',
		url: 'http://api.soundcloud.com/tracks/' + track_id + '/stream?client_id=' + soundcloud_key
	    });

	    SBsound.setPosition($(this).attr("timestamp"))
	    SBsound.play();


	});

	$('.stop').click(function() {
	    SBsound.stop();
	});

	
    },
    ontimeout: function() {
	// Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
    }
      
});


