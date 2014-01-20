var app = app || {}

app.SoundManager_Player = Backbone.Model.extend({


    initialize: function() {
	this._player =  null;
	this._sound=null;
	this._init_player();
    },

    _init_player : function() 
    {

	soundManager.setup({
	    url: '/swf',
	    flashVersion: 9,
	    preferFlash: false,
	    debugMode: true,
	    onready: function() {},
	    ontimeout: function() {}
	});

    },
    _load : function(track_id, timestamp) 
    {
	var soundcloud_key = $('#soundcloud_key').attr('data');
	var self = this;
        this._sound = soundManager.createSound({
            id: '_sound',
            url: 'http://api.soundcloud.com/tracks/' + track_id + '/stream?client_id=' + soundcloud_key,
	    stream: true,
	    from: timestamp,
	    onload: function() {
		self._sound.setPosition(timestamp)
		self._sound.play()
	    }
        }).load();
	//this._sound.setPosition(timestamp);        
    },
    play : function(track_id, timestamp) {
	console.log("[SoundManager] play")
        this._load(track_id, timestamp)

//        this._sound.play();



    },
    resume: function() {},
    pause: function() {},
    stop : function()
    {
	console.log("[Soundmanager] stop")
	this._sound.stop()
    },
    unload : function() 
    {
	console.log("[Soundmanager] destruct")
	this._sound.destruct()
    }
});
