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
	
	this._load_player(); //load player

	app.vent.on("YouTube_Player:set_player", this.set_player, this)
    },

    _load_player : function() {
	// load the IFrame Player API code asynchronously.
	console.log("[YouTube_Player] _load_player");
	var tag = document.createElement('script');
	tag.src = "http://www.youtube.com/iframe_api";
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
	console.log("[YouTube_Player] onPlayerReady")
	this._play(this._track_id, this._timestamp)
    },

    onPlayerStateChange : function(e) {
	this.state = e.data
	console.log('[YouTube_Player] onPlayerStateChange')
	console.log(e)
	console.log("state: " + this.state)
	console.log(this)

	if ( this.state === YT.PlayerState.ENDED ) {
	    app.vent.trigger("Player:next")
	}

    },

    onPlayerError : function(event) {
	console.log("[YouTube_Player] onPlayerError")
	console.log(event)
	console.log(event.data)
	app.vent.trigger("Player:next")
    },
    
    /* Create YT.Player */
    set_player : function() {
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
	console.log("[YouTube_Player]")

	if (!this._player) 
	{
	    /* player not yet loaded:
	     * i.e. case of initial player load _play action
	     * called in onPlayerReady, here we just set track
	     */

	    console.log('[YouTube_player] setting track')
	    this._track_id = track_id
	    this._timestamp = timestamp
	}
	else {
	    console.log('[YouTube_Player] play')
	    this._track_id = track_id
	    this._timestamp = timestamp
	    
	    this._play(track_id, timestamp)
	}


    },

    _play : function(track_id, timestamp) {
	console.log("[YouTube_Player] _play")
	console.log(track_id)
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

	console.log(this._player)

	console.log("end youtube _play")
    },


    stop : function() {
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
    }
	
});


