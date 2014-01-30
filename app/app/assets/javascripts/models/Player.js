var app = app || {};


app.Player = Backbone.Model.extend({

    initialize: function(view) {
	console.log("[Player] initialize")

	this.loaded_players = {};
	this.current_player = null;
	this.soundmanager_player = null;
	this.youtube_player = null;
	this.view = view;
    },
    
    play :  
    {
	/*
	 * note: we pass the instance "self" because this 
	 * gets a messed up reference since we're doing nested
	 * objects to choose services (in constrast look at stop()
	 */
	youtube : function(self,track_id, timestamp)
	{
	    console.log(self)
	    if (!self.loaded_players['youtube']) 
	    {
		console.log("[youtubeplayer.init_player]")
		self.youtube_player = new app.YouTube_Player();
		self.loaded_players['youtube'] = true
	    }

	    self.stop(self);

	    self.current_player = self.youtube_player;
	    self.youtube_player.play(self.youtube_player, track_id, timestamp)
	    self.view.render_youtube();
	},

	soundcloud : function(self, track_id, timestamp)
	{

	    console.log(self)
	    //load player if not loaded
	    if (!self.loaded_players['soundmanager'])
	    {
		console.log("[soundmanager.init_player]")
		self.soundmanager_player = new app.SoundManager_Player();
		self.loaded_players['soundmanager'] = true
	    }
	    
	    //stop any previous playing tracks
	    self.view.clear_youtube();

	    self.stop(self);



	    //play new track
	    self.current_player = self.soundmanager_player;
	    self.current_player.play(track_id, timestamp)
	}

    },

    stop : function()
    {

	//stop playback
	if (this.current_player != null) {
	    console.log("[Player] stop")
	    this.view.clear_youtube();
	    this.current_player.stop();
	    //$('#player').css('display', 'none');
	}	    
    },
    seek: {
	soundcloud: function(time) {},
	youtube : function(time){}
    },
    pause : function(){},
    resume : function(){},
    next : function(){},
    prev : function(){}
    


});

