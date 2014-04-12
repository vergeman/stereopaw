
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

/*
current track in set
		    mc.nowPlaying.currentDisplayTrack.artist,
		    mc.nowPlaying.currentDisplayTrack.title,
*/

	    var mc = $('.player').scope()

	    if (mc.playerStarted) {

		_track.set(
		    mc.waveformUrl.match(/([^\/]+)\.json/)[1],
		    mc.currentCloudcast.owner,
		    mc.currentCloudcast.title,
		    "//www.mixcloud.com" + mc.currentCloudcast.ownerUrl,
		    mc.audioLength * 1000,
		    mc.audioPosition,
		    SB.Util.toTime(mc.audioPosition, "secs"),
		    "//www.mixcloud.com" + mc.currentCloudcast.url,
		    true,
		    "mixcloud",
		    mc.currentCloudcast.mobilePlayerFullImage
		)

	    } else {

		var hrs = $('.cloudcast-time').html().match(/(\d+)h/)
		var mins = $('.cloudcast-time').html().match(/(\d+)m/)
		_track.set(
		    undefined,
		    $('span[itemprop="name"]').html(),
		    $('.cloudcast-title').html(),
		    "//www.mixcloud.com" + $('.cloudcast-uploader').attr("href"),
		    SB.Util.textToSecs(hrs, mins, 0) * 1000,
		    0,
		    "0:00",
		    window.location.href.match("[^(http|https):]\.*"),
		    true,
		    "mixcloud",
		    $('.cloudcast-image').attr("src")
		);


	    }


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

	    var artwork_url = sc_md.sound.attributes.artwork_url || 
		sc_md.sound.attributes.user.avatar_url;
	    artwork_url == null ? "" : artwork_url.replace("-large.jpg", "-t200x200.jpg");

	    _track.set
	    (
		sc_md.sound.attributes.id,
		sc_md.sound.attributes.user.username,
		sc_md.sound.attributes.title,
		sc_md.sound.attributes.user.permalink_url.replace(/^(http|https):\/\//, "//"),
		sc_md.sound.attributes.duration,
		sc_time,
		SB.Util.toTime(sc_time, "ms"),
		sc_md.sound.attributes.permalink_url.replace(/^(http|https):\/\//, "//"),
		(sc_md.sound.attributes.sharing == "public" ? true : false),
		_service,
		artwork_url.replace(/^(http|https):\/\//, "//")
	    );

	},

	/*
	 * YOUTUBE
	 */
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
		ytplayer.config.args.loaderUrl.replace(/^(http|https):\/\//, "//"),
		yt_duration,
		yt_time,
		SB.Util.toTime(yt_time, "secs"),
		ytplayer.config.args.loaderUrl.replace(/^(http|https):\/\//, "//"),
		true,
		_service,
		"//img.youtube.com/vi/" + ytplayer.config.args.video_id + "/0.jpg"
	    );

	},
	'spotify': function() 
	{

	    /*not sure if it's always window.frames[1] - will have to do a check */
	    
	    var duration = SB.Util.TimetoMs(window.frames[1].document.getElementById('track-length').innerHTML);

	    var time = SB.Util.TimetoMs(window.frames[1].document.getElementById('track-current').innerHTML);

	    //convert track-length/track-current to ms
	    _track.set
	    (
		window.frames[1].document.getElementById('track-name').children[0].href.match(/track\/(.*)/)[1],
		window.frames[1].document.getElementById('track-artist').children[0].text,
		window.frames[1].document.getElementById('track-name').children[0].text,
		window.frames[1].document.getElementById('track-artist').children[0].href,
		duration,
		time,
		window.frames[1].document.getElementById('track-current').innerHTML,
		window.frames[1].document.getElementById('track-name').children[0].href,
		true,
		"spotify",
		try_get(
		    function() {
			return window.frames[1].document.getElementsByClassName('sp-image-img')[0].getAttribute("style").match(/http[^)(]+/)[0] },
		    function() { return null }
		)
	    )



	},
	'grooveshark' : function() {},
	'8tracks' : function() {},
	'earbits' : function() {},
	'pandora': function() {},
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

    //called in stereopaw.js
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
