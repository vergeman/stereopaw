/* Player */
var SBPlayer = (function() {
    var loaded_players={};
    var current_player = null;
    var track = null;

    /*controls logic across multiple players*/
    var SBPlayer = {
	_init : function() {
	    self = this;
	},

	_init_player : {
	    youtube : function() 
	    {
		self.ytPlayer._init_player();
	    },
	    soundcloud : function()
	    {
		self.smPlayer._init_player();
	    }
	},
	play : {
	    youtube : function(track_id, timestamp)
	    {
		if (!loaded_players['youtube']) 
		{
		    console.log("[SBPlayer.init_player]")
		    SBPlayer._init_player.youtube();
		    loaded_players['youtube'] = true
		}

		SBPlayer.stop();
		$('#player').css('display', 'block');
		SBPlayer.ytPlayer.play(track_id, timestamp)

		current_player = SBPlayer.ytPlayer;
		track = "youtube " + track_id
		console.log("end play")
	    },
	    soundcloud : function(track_id, timestamp)
	    {

		//load player if not loaded
		if (!loaded_players['soundmanager'])
		{
		    console.log("[SBPlayer.init_player]")
		    SBPlayer._init_player.soundcloud();
		    loaded_players['soundmanager'] = true
		}
	
		//stop any previous playing tracks
		SBPlayer.stop();

		//play new track
		SBPlayer.smPlayer.play(track_id, timestamp)
		current_player = SBPlayer.smPlayer;
		track = "soundcloud " + track_id
	    }
	},
	stop : function()
	{

	    //stop playback
	    if (current_player != null) {
		console.log("[SBPlayer] stop")
		current_player.stop();
		current_player.unload();
		$('#player').css('display', 'none');
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
    }; 


    return SBPlayer;
}() );

SBPlayer._init();

