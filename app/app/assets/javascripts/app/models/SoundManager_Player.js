var app = app || {}

app.SoundManager_Player = Backbone.Model.extend({


    initialize: function() {
	this._player =  null;
	this._sound=null;
	this._ready = null;
	this._track = null;
	this._timestamp=null;
	this._init_player();
	this.SOUNDCLOUD_KEY = "82d79419cef128093cfca50715c23cd7"
    },

    buildUrl : function(track) {
	switch(track.get("service"))
	{
	case "soundcloud" :
	    return 'http://api.soundcloud.com/tracks/' + track.get("track_id") + '/stream?client_id=' + this.SOUNDCLOUD_KEY

	default:
	    return "";
	}

    },

    _init_player : function()
    {
	var self = this;

	soundManager.setup({
	    url: '/swf',
	    flashVersion: 9,
	    useHTML5Audio : true,
	    preferFlash: false,
	    debugMode: true,
	    onready: function() {
		self._ready = true;
		if (self._track || self.timestamp) {
		    /*
		      track_id/timetstamp is null, we haven't called play yet,
		      so don't load. If populated, we've called play, but sm
		      wasn't ready at the time -- now it is so load.
		    */
		    self._load(self._track, self._timestamp)
		}
	    },
	});
	if (DEBUG)
	    console.log("init_player")
    },

    _load : function(track, timestamp)
    {
	var self = this;

	this._sound = soundManager.createSound({
	    id: '_sound',
	    url: self.buildUrl(track),
	    stream: true,

	    onload: function(is_ok) {

		self._sound.setPosition(timestamp)

		if (!is_ok) {
		    /*sound didn't load properly*/
		    if (DEBUG)
			console.log("[SoundManager_Player] fail load")
		    app.vent.trigger("Player:next")
		}
		else {
		    self._play()
		}


	    }
	}).load()

    },

    _play : function() {

	this._sound.play(
	    {
		//position: timestamp,
		onfinish: function() {
		    app.vent.trigger("Player:next")
		}
	    }
	)

    },

    getElapsed : function() {
	if (!this._sound || !this._sound.position) {
	    return 0;
	}
	return this._sound.position
    },

    play : function(track, timestamp) {
	if (DEBUG)
	    console.log("[SoundManager] play")

	if (this._ready) {
	    this._load(track, timestamp)
	}
	this._track = track
	this._timestamp = timestamp

    },
    resume: function() {
	this._sound.resume()
    },
    pause: function() {
	this._sound.pause()
    },
    seek : function(time) {
	//msec offset
	this._sound.setPosition(time)
    },
    stop : function()
    {
	if (DEBUG)
	    console.log("[Soundmanager] stop")

	this._sound.stop();
	this.unload();
    },
    unload : function()
    {
	if (DEBUG)
	    console.log("[Soundmanager] destruct")

	this._sound.destruct()
    }
});
