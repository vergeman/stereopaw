function onYouTubeIframeAPIReady() {

    SBPlayer.ytPlayer._player = new YT.Player('player', {
	height: '360',
	width: '640',	
	//videoId: track_id,
	events: {
	    'onReady': SBPlayer.ytPlayer.onPlayerReady,
	    'onStateChange': SBPlayer.ytPlayer.onPlayerStateChange
	},
	playerVars: 
	{
	    controls : 0,
	    modestbranding: 1,
	    rel : 0,
	    showinfo: 0
	}
    });

}


SBPlayer.ytPlayer = (function() {
    var _player;
    var  _track_id, _timestamp;
    var self;

    var ytPlayer = {
	_init_player : function() {
	    // load the IFrame Player API code asynchronously.
	    var tag = document.createElement('script');
	    tag.src = "https://www.youtube.com/iframe_api";
	    var firstScriptTag = document.getElementsByTagName('script')[0];
	    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	    self = this;
	},
	onPlayerReady : function(event) {
	    //event.target.playVideo();
	    console.log("ytplayer ready")
	    ytPlayer._play(_track_id, _timestamp)
	},
	onPlayerStateChange : function(event) {},

	/* called by SBPlayer */
	stop : function() {
	    console.log("youtube stop")
	    self._player.stopVideo();
	},
	unload : function() {
	    self._player.clearVideo();
	},
	_play : function(track_id, timestamp) {
	    console.log("load video by id")
	    self._player.loadVideoById
	    (
		{
		    'videoId' : track_id,
		    'startSeconds' : timestamp
		}
	    )
	    console.log("playvideo");
	    self._player.playVideo();
	},
	play : function(track_id, timestamp) {
	    console.log("youtube play")	   

	    //player hasn't loaded, queue track
	    if (!self._player) 
	    {
		_track_id = track_id
		_timestamp = timestamp
	    }
	    else {
		console.log("playing")
		self._play(track_id, timestamp)
	    }

	}
	
    };

    return ytPlayer;

}());


