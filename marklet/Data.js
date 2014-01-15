
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
    var _service = null,
    _track = null,
    _player = null;

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


    var _set = {

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

	    //player
	    _player = sc_mgr.getCurrentSound()

	    //track meta data
	    var sc_md = sc_mgr.getCurrentMetadata()
	    var sc_time = sc_md.sound.audio.currentTime()

	    _track.set
	    (
		sc_md.sound.attributes.id,
		sc_md.sound.attributes.user.username,
		sc_md.sound.attributes.title,
		sc_md.sound.attributes.user.permalink_url,
		sc_md.sound.attributes.duration,
		sc_time,
		SB.Util.toTime(sc_time, "ms"),
		sc_md.sound.attributes.permalink_url,
		(sc_md.sound.attributes.sharing == "public" ? true : false),
		_service
	    );

	},
	'youtube' : function() {
	    if(_player == null) {
		_player = document.getElementById("movie_player");
	    }

	    var yt_artist = try_get
	    (
		function() { return document.getElementsByClassName('metadata-info-title')[1].nextSibling.nextSibling.innerHTML},
		function() { return "" },
		""
	    )


	    var yt_title = try_get
	    (
		function() 
		{
		    return document.getElementsByClassName('metadata-info-title')[0].innerHTML.match(/"(.*)\"/)[1]
		},
		function() 
		{
		    return ytplayer.config.args.title
		},
		""
	    )

	    var yt_time = try_get
	    (
		function() 
		{ 
		    return _player.getCurrentTime();
		},
		function() { return 0 },
		0
	    )

	    var yt_duration = try_get
	    (
		function() 
		{ 
		    return _player.getDuration();
		},
		function() { return 0 },
		0
	    )

	    _track.set
	    (
		ytplayer.config.args.video_id,
		yt_artist,
		yt_title,
		ytplayer.config.args.loaderUrl,
		yt_duration,
		yt_time,
		SB.Util.toTime(yt_time, "secs"),
		ytplayer.config.args.loaderUrl,
		true,
		_service
	    );

	},
	'grooveshark' : function() {},
	'8tracks' : function() {},
	'earbits' : function() {},
	'pandora': function() {},
	'spotify': function() {},
	'NA' : function()
	{
	    return "NA"
	}


    }

/*
 * _audiomgr: service specific interface for controlling their player 
 * set the reference to the player in _set
 */
    var _audiomgr = {

	'soundcloud' : {

	    'seek' : function(percentage) {
		_player.seek( percentage * _track.getDuration() );
	    },
	    'pause' : function() {

	    },
	    'play' : function() {

	    }

	},
	'youtube' : {
	    'seek' : function(percentage) {
		_player.seekTo( percentage * _track.getDuration() )
	    },
	    'pause' : function() {

	    },
	    'play' : function() {

	    }

	},
	'NA' : function() { return "NA" }

    }

    
    var data = {};

    //called in SoundByte.js
    data.setTrack = function(service, track) {
	_service = service;
	_track = track;
	_set[_service]()
    }

    /*want to separate service & player */
    data.seek = function(percentage) {
	_audiomgr[_service]['seek'](percentage);
    }

    return data;

}());
