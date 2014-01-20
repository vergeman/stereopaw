var app = app || {};

function onYouTubeIframeAPIReady() {

    app.player.youtube_player.set_player();
}


app.YouTube_Player = Backbone.Model.extend({

    initialize: function() {
	this._player = null;
	this. _track_id = null;
	this._timestamp=null
	this._init_player();
    },

    _init_player : function() {
	// load the IFrame Player API code asynchronously.
	console.log("_init_Player");
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },

    onPlayerReady : function(event) {

	//this: onPlayerReady callled from global scope, so we pass it binded this in set_player

	this._play(this._track_id, this._timestamp)
    },

    onPlayerStateChange : function(event) {},

    onPlayerError : function(event) {
	console.log("error")
	console.log(event)
	console.log(event.data)
	
    },

    set_player : function() {
	console.log("setPlayer")

	this._player = new YT.Player('player', {
	    height: '360',
	    width: '640',	
	    //videoId: track_id,
	    events: {
		'onReady': _.bind(this.onPlayerReady, this),
		'onStateChange': this.onPlayerStateChange,
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

    //called by Player

    play : function(self, track_id, timestamp) {
	console.log("youtube play")	   

	//player hasn't loaded, queue track
	if (!this._player) 
	{
	    this._track_id = track_id
	    this._timestamp = timestamp
	}
	else {
	    this._track_id = track_id
	    this._timestamp = timestamp
	    
	    this._play(track_id, timestamp)
	}

    },

    _play : function(track_id, timestamp) {

	this._player.loadVideoById
	(
	    {
		'videoId' : track_id,
		'startSeconds' : timestamp
	    }
	)
	//flash has an error (undefined to obj, toString access)
	//just click again it goes away
	//repeatable: youtube song, souncloud, breaks on next youtube
	this._player.playVideo();
	console.log("STATE")
	console.log(this._player)
	if (this._player.getPlayerState() === "undefined" ) {
	    this._play(track_id, timestamp)
	}
	    
    },


    stop : function() {
	console.log("youtube stop")
	this._player.stopVideo();
    },
    unload : function() {
	this._player.clearVideo();
    }
	
});


