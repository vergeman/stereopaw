var app = app || {};

function onYouTubeIframeAPIReady() {
    //need global event bus to call PlayerView.set_youtube()
    app.vent.trigger("YouTube_Player:set_player");
}

app.YouTube_Player = Backbone.Model.extend({

    initialize: function() {
	this._player = null
	this. _track_id = null
	this._timestamp = null
	this.volume = null;

	this._load_player(); //load player

	this.listenTo(app.vent, "YouTube_Player:set_player", this.set_player)
    },

    _load_player : function() {
	// load the IFrame Player API code asynchronously.
	if (DEBUG)
	    console.log("[YouTube_Player] _load_player");

	var tag = document.createElement('script');
	tag.src = "//www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },

    /* YT Events - this: 
     * onPlayerReady/onPlayerStateChange/onError
     * called from global scope, so we bind YouTube_Player 
     * context 'this' in set_player
     */

    onPlayerReady : function(event) {
	//post load - used only for play
	if (DEBUG)
	    console.log("[YouTube_Player] onPlayerReady")

	this._play(this._track_id, this._timestamp)
	this._player.setVolume(this.volume)
    },

    onPlayerStateChange : function(e) {
	this.state = e.data
	if (DEBUG)
	    console.log('[YouTube_Player] onPlayerStateChange')
	if (DEBUG)
	    console.log(e)
	if (DEBUG)
	    console.log("state: " + this.state)
	if (DEBUG)
	    console.log(this)

	if ( this.state === YT.PlayerState.ENDED ) {
	    this.hide()
	    this._player.clearVideo()
	    app.vent.trigger("Player:next")
	}

    },

    onPlayerError : function(event) {
	if (DEBUG)
	    console.log("[YouTube_Player] onPlayerError")
	if (DEBUG)
	    console.log(event)
	if (DEBUG)
	    console.log(event.data)
	app.vent.trigger("Player:next")
    },
    
    /* Create YT.Player */
    set_player : function() {
	if (DEBUG)
	    console.log("[YouTube_Player] set_player")

	this._player = new YT.Player('ytplayer', {
	    width: '266.7',
	    height: '200',
	    events: {
		'onReady': _.bind(this.onPlayerReady, this),
		'onStateChange': _.bind(this.onPlayerStateChange, this),
		'onError' : _.bind(this.onPlayerError, this)
	    },
	    playerVars: 
	    {
		controls : 0,
		modestbranding: 1,
		rel : 0,
		showinfo: 0
	    }
	});

    },

    show : function () {
	app.vent.trigger("YouTube_Player:show");
    },

    hide : function() {
	app.vent.trigger("YouTube_Player:hide");
    },
    //called by Player
    seek : function(time) {
	//secs
	this._player.seekTo(time, true)
    },
    pause : function() {
	this._player.pauseVideo()
    },
    resume : function() {
	this._player.playVideo()
    },
    play : function(self, track_id, timestamp) {
	if (DEBUG)
	    console.log("[YouTube_Player]")

	if (!this._player) 
	{
	    /* player not yet loaded:
	     * i.e. case of initial player load _play action
	     * called in onPlayerReady, here we just set track
	     */

	    if (DEBUG)
		console.log('[YouTube_player] setting track')

	    this._track_id = track_id
	    this._timestamp = timestamp
	}
	else {
	    if (DEBUG)
		console.log('[YouTube_Player] play')

	    this._track_id = track_id
	    this._timestamp = timestamp
	    
	    this._play(track_id, timestamp)
	}


    },

    _play : function(track_id, timestamp) {
	if (DEBUG)
	    console.log("[YouTube_Player] _play")
	if (DEBUG)
	    console.log(track_id)
	if (DEBUG)
	    console.log(timestamp)

	this.show();	

	this._player.loadVideoById
	(
	    {
		'videoId' : track_id,
		'startSeconds' : timestamp
	    }
	)
	this._player.playVideo();

	if (DEBUG)
	    console.log(this._player)

	if (DEBUG)
	    console.log("end youtube _play")
    },

    stop : function() {
	if (DEBUG)
	    console.log("[YouTube_Player] stop")

	this._player.pauseVideo();

	this.hide();
    },

    getElapsed : function() {
	//elapsed secs
	if (!this._player || (typeof this._player.getCurrentTime === 'undefined') ) {
	    return 0
	}
	return this._player.getCurrentTime();
    },

    set_volume : function(vol) {
	if (DEBUG)
	    console.log("[YouTube_Player] set_volume")

	/*
	 *set volume for player
	 *if player not ready, set volume variable
	 *and try again to set player volume in
	 *onPlayerReady()
	 */

	if (this._player) {
	    this._player.setVolume(vol)
	}
	this.volume = vol

    }

});


