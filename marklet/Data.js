
/*
 * SBData
 * parses data for given service, updates track


TODO:
  Error handling for each data piece 
    (things can change, don't want to totally break submission)
  SubTrack & SubArtists for services with it
  probably need a widget friendly ID from each service
 */

SB.Data = (function() {
    _service = null;
    _track = null;

    /* 
     * try/catch around data grab
     * handles only main and one alternate for now
     */
    function try_get(f1, f2, def) {
	try {
	    return f1();
	}
	catch(err) {
	    try {
		return f2(); 
	    }
	    catch (err2) {
		return def;
	    }
	}

    }


    _set = {

	/*
	 * MIXCLOUD
	 */

	'mixcloud': function() 
	{
	    var mc = {}, mc_time;

	    mc = try_get(
		function() { return $("#player-module").data()['controller:player_module'].playerStatus }, 
		function() { return 0; },
		{}
	    )

	    mc_time = try_get(
		function() { return mc.audio_position},
		function() { return 0; },
		0
	    )
	    
	    _track.set(
		try_get( function() { return $('#cloudcast-owner-link > span')[0].innerHTML; }, 
			 function() { return $('#cloudcast-owner-link')[0].innerHTML; },
			 ''
		       ),
		$('#cloudcast-name').html(),
		"http://www.mixcloud.com" + $('#cloudcast-owner-link').attr("href"),
		mc.now_playing_audio_length,
		mc_time,
		SB.Util.toTime(mc_time, "secs"),
		"http://www.mixcloud.com" + mc.now_playing_key
	    );
	},

	/*
	 * SOUNDCLOUD
	 */

	'soundcloud': function() 
	{
	    /*distinct vs mobile - need mobile filter*/		
	    var sc_mgr = require("lib/play-manager")
	    var sc_md = sc_mgr.getCurrentMetadata()

	    var sc_time = sc_md.sound.audio.currentTime()

	    _track.set
	    (
		sc_md.sound.attributes.user.username,
		sc_md.sound.attributes.title,
		sc_md.sound.attributes.user.permalink_url,
		sc_md.sound.attributes.duration,
		sc_time,
		SB.Util.toTime(sc_time, "ms"),
		sc_md.sound.attributes.permalink_url
	    );
	},
	'spotify': function() {
	    


	},
	'youtube' : function() {},
	'grooveshark' : function() {},
	'8tracks' : function() {},
	'pandora': function() {},
	'NA' : function()
	{
	    return "NA"
	}


    }


    /*public*/
    var data = {};

    data.setTrack = function(service, track) {
	_service = service;
	_track = track;
	_set[_service]()
    }

    return data;
}());
