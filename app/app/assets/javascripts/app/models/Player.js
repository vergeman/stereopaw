var app = app || {};

/* 
 * Player controls and interface for multiple players
 * try to keep any dom stuff, playlist, etc outside
 * strictly cross-player mechancis
 */
app.Player = Backbone.Model.extend({

    initialize: function() {
	if (DEBUG)
	    console.log("[Player] initialize")

	this.initialized_players = {};
	this.current_player = null;
	this.soundmanager_player = null;
	this.youtube_player = null;


	/*
	 *set initial volume value 
	 *take from cookie, or default to 100
	 */
	this.volume = $.cookie("volume") || 100	
	$.cookie("volume", this.volume)

	this.listenTo(app.vent, "Player:set_volume",
		      this.set_volume)
    },

    getElapsed : function()
    {
	if (!this.current_player) {
	    return 0;
	}

	return this.current_player.getElapsed();
    },

    play :  
    {
	/*
	 * note: we pass the instance "self" because 'this' 
	 * gets varied context (nested
	 * object in choosing services) (in constrast look at stop() 
	 */
	youtube : function(self, track, timestamp)
	{
	    /*load youtube player*/
	    if (DEBUG)
		console.log(self)

	    if (!self.initialized_players['youtube']) 
	    {
		if (DEBUG)
		    console.log("[youtubeplayer.init_player]")

		self.youtube_player = new app.YouTube_Player();
		self.initialized_players['youtube'] = true
	    }

	    self.stop();

	    self.current_player = self.youtube_player;

	    self.current_player.play(self.youtube_player, track.get("track_id"), timestamp)

	    if (DEBUG)
		console.log("VOLUME: " + self.volume)

	    self.set_volume(self.volume)
	},

	soundcloud : function(self, track, timestamp)
	{
	    /* load SMplayer */
	    if (DEBUG)
		console.log(self)
	    
	    if (!self.initialized_players['soundmanager'])
	    {
		if (DEBUG)
		    console.log("[soundmanager.init_player]")

		self.soundmanager_player = new app.SoundManager_Player();
		self.initialized_players['soundmanager'] = true
	    }
	    
	    //stop any previous playing tracks
	    self.stop();

	    //play new track
	    self.current_player = self.soundmanager_player;

	    self.current_player.play(track, timestamp)

	    self.set_volume(self.volume)
	}

    },

    stop : function()
    {

	//stop playback
	if (this.current_player != null) {
	    if (DEBUG)
		console.log("[Player] stop")

	    this.current_player.stop();
	}

    },
    seek : function(time) {
	this.current_player.seek(time)
   },
    pause : function(){
	this.current_player.pause()
    },
    resume : function(){
	this.current_player.resume()
    },

    set_volume : function(vol) {
	if (DEBUG)
	    console.log("[Player] set_volume: " + vol)

	/*vol 0-100*/
	this.volume = vol
	this.current_player.set_volume(this.volume)
    }
});

