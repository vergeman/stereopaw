var app = app || {};

/* 
 * Player controls and interface for multiple players
 * try to keep any dom stuff, playlist, etc outside
 * strictly cross-player mechancis
 */
app.Player = Backbone.Model.extend({

    initialize: function() {
	console.log("[Player] initialize")

	this.initialized_players = {};
	this.current_player = null;
	this.soundmanager_player = null;
	this.youtube_player = null;

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
	    console.log(self)
	    if (!self.initialized_players['youtube']) 
	    {
		console.log("[youtubeplayer.init_player]")
		self.youtube_player = new app.YouTube_Player();
		self.initialized_players['youtube'] = true
	    }

	    self.stop();

	    self.current_player = self.youtube_player;

	    self.current_player.play(self.youtube_player, track.get("track_id"), timestamp)
	},

	soundcloud : function(self, track, timestamp)
	{
	    /* load SMplayer */
	    console.log(self)
	    if (!self.initialized_players['soundmanager'])
	    {
		console.log("[soundmanager.init_player]")
		self.soundmanager_player = new app.SoundManager_Player();
		self.initialized_players['soundmanager'] = true
	    }
	    
	    //stop any previous playing tracks
	    self.stop();

	    //play new track
	    self.current_player = self.soundmanager_player;

	    self.current_player.play(track, timestamp)
	}

    },

    stop : function()
    {

	//stop playback
	if (this.current_player != null) {
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
    }

});

