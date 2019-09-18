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
    _mode =null;

    /*soundcloud toggles and data*/
    var sc_data = sc_data || {};
    _sc_load_status = 0;

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

    function load_empty_track() {

	_track.set
	(
	    null,
	    "Please select something to play",
	    "Nothing Loaded",
	    null,
	    null,
	    0,
	    "0:00",
	    null,
	    false,
	    _service,
	    null
	);

	$("#sb-submit-button").css('display', 'none');
    }

    function refresh_view() {
	if (_mode == MODE.MARKLET) {
	    document.getElementById('sb-track-title-label').style.display = 'block';

	    document.getElementById('sb-track-artist-label').style.display='block';

	    $("#sb-submit-button").css('display', 'block');
	}
    }

    var _set = {

	/*
	 * SOUNDCLOUD
	 */

	'soundcloud': function()
	{

            var noresults = false;

	    /*distinct vs mobile - need mobile filter*/
            _isPlaying = $('.playControls__playPauseSkip .playing');

	    /* no sound loaded/playing */
	    if(!_isPlaying) {
		load_empty_track();
		return;
	    }

	    refresh_view();

	    /*load track meta data*/
            var $title = $('title');
            var title =
                (typeof $title.text == "function") ? $title.text() : $title.text;

            track = sc_data['title'];

            var track_artist = title.split(/ by / );
            var track, artist;

            if (track_artist.length == 1) {
                /*edge case sometimes there's no 'by'?*/
                track_artist = title.split(/-/);

                if(track_artist.length == 1) {
                    track = track_artist[0].trim();
                } else {
                    artist = track_artist[0].trim();
                    track = track_artist[1].trim();
                }
            }
            else {
                /*most cases has split w/ 'by' b/w artist and track*/
                track = track_artist[0].trim();
                artist = track_artist[1].trim();
            }

            //weird playlist case
            if (!track) {
                track = $('.playbackSoundBadge__title > a').attr('title').trim();
            }

            if (!artist) {
                artist = $('.playbackSoundBadge__titleContextContainer > a')[0].innerText.trim();
            }

            sc_data['title'] = sc_data['track'] || track;
            /*
             *_sc_load_status:
             * 0 - neverloaded
             * 1 - loading
             * 2 - done
             */

            if (_sc_load_status == 0 && !noresults) {
                _sc_load_status = 1;

                $.get("https://api.soundcloud.com/tracks",
                      {q: title + " " + artist,
                       client_id: "82d79419cef128093cfca50715c23cd7"},
                      function(data) {

                          if ( data.length == 0 ) {
                              noresults = true;
                              _sc_load_status = 2; //toggle complete
                          }

                          /*loop and try to find exact track match from search results*/
                          for (var i = 0; i < data.length; i++ ) {
                              var obj = data[i];

                              if (obj['kind'] == "track" &&
                                  (obj['title'] + " by " +
                                   obj['user']['username'] == track_artist.join(' by '))) {
                                  sc_data = obj;
                                  _sc_load_status = 2; //toggle complete
                              }
                          }

                      });
            }


            /* old track ends, new track plays, so retoggle for info*/
            if (sc_data['title'] != track && _sc_load_status == 2) {
                _sc_load_status = 0;
            }

            /*if we're not done loading, don't update values*/
            if (_sc_load_status != 2)
                return;

            var sc_time = $('.playbackTimeline__timePassed > span')[1].innerText;
            var sc_duration = $('.playbackTimeline__duration > span')[1].innerText;

            //weird playlist format hack
            sc_data['user'] = {
                username: artist,
                permalink_url: (sc_data['user'] && sc_data['user']['permalink_url']) ||
                    $('.playbackSoundBadge__titleLink')[0].href
            };

            var artwork_url = sc_data['artwork_url'] || sc_data['user']['avatar_url'];
	    artwork_url = artwork_url == null ?
                "" : artwork_url.replace("-large.jpg", "-t200x200.jpg");


	    _track.set
	    (
		sc_data['id'],
		sc_data['user']['username'],
		sc_data['title'],
		sc_data['user']['permalink_url'].replace(/^(http|https):\/\//, "//"),

                SB.Util.TimetoMs(sc_duration),
                SB.Util.TimetoMs(sc_time),
                SB.Util.toTime(SB.Util.TimetoMs(sc_time) / 1000, "secs"),

		sc_data['user']['permalink_url'].replace(/^(http|https):\/\//, "//"),
		(sc_data['sharing'] == "public" ? true : false),
		_service,
		artwork_url.replace(/^(http|https):\/\//, "//")
	    );
            console.log(_track.toJSON())
            console.log(_track.getElapsed())
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
		function() { return _player.getVideoData().author },
		function() { return "" },
		""
	    )


	    var yt_title = try_get
	    (
		function()
		{
		    return $('title')[0].innerText;
		},
		function()
		{
		    return _player.getVideoData().title;
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

	    refresh_view()

	    /*nothing loaded*/
	    if (!("https://www.youtube.com/watch?v=" + _player.getVideoData().video_id)) {
		load_empty_track()

		return
	    }

	    /*populate yt args*/
	    _track.set
	    (
		_player.getVideoData().video_id,
		yt_artist,
		yt_title,
		("https://www.youtube.com/watch?v=" + _player.getVideoData().video_id)
                    .replace(/^(http|https):\/\//, "//"),
		yt_duration,
		yt_time,
		SB.Util.toTime(yt_time, "secs"),
                ("https://www.youtube.com/watch?v=" + _player.getVideoData().video_id)
                    .replace(/^(http|https):\/\//, "//"),
		true,
		_service,
		"//img.youtube.com/vi/" + _player.getVideoData().video_id + "/0.jpg"
	    );

	},


	'stereopaw' : function() {

	    if (!app.current_track) {
		load_empty_track()
		return
	    }

	    refresh_view()

	    _track.set
	    (
		app.current_track.track_id,
		app.current_track.artist,
		app.current_track.title,
		app.current_track.profile_url,
		app.current_track.duration,
		app.current_track.elapsed,
		app.current_track.timeformat,
		app.current_track.page_url,
		true,
		app.current_track.service,
		app.current_track.artwork_url
	    )

	},

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
    data.setTrack = function(mode, service, track) {
	_mode = mode;
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
