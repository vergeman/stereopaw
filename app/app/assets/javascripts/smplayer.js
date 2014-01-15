SBPlayer.smPlayer = (function() {
    var _player;
    var _sound;

    var smPlayer = {
	_init_player : function() 
	{

	    soundManager.setup({
		url: '/swf',
		flashVersion: 9,
		preferFlash: false,
		onready: function() {},
		ontimeout: function() {}
	    });

	},
	_load : function(track_id) 
	{

	    var soundcloud_key = $('#soundcloud_key').attr('data');

	    _sound = soundManager.createSound({
		id: '_sound',
		url: 'http://api.soundcloud.com/tracks/' + track_id + '/stream?client_id=' + soundcloud_key
	    });

	},
	play : function(track_id, timestamp) {
	    console.log("[SoundManager] play")

	    this._load(track_id)
	    _sound.setPosition(timestamp)
	    _sound.play();
	},
	resume: function() {},
	pause: function() {},
	stop : function()
	{
	    console.log("[Soundmanager] stop")
	    _sound.stop()
	},
	unload : function() 
	{
	    console.log("[Soundmanager] destruct")
	    _sound.destruct()
	}
    }

    return smPlayer;
})();






