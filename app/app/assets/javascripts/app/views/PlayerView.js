var app = app || {}


/* try to keep limited to view & click events */

app.PlayerView = Backbone.View.extend({

    el: '#player',

    /*playerview - tracks_collection needed for internal queue*/
    initialize: function(player, playerqueue, tracks_collection) {

	console.log("[PlayerView] initialize")

	this.playerslider = new app.PlayerSliderView()

	this.player = player;
	this.playerqueue = playerqueue;

	this._update_time_interval = null;
	this.current_track = null;

	/* seek, next, prev, play
	 * onclick, or when
	 * events called on finished track, auto move next
	 * called by YT/SoundManager_Player
	 */
	this.listenTo(app.vent, "Player:seek", this.seek)
	this.listenTo(app.vent, "Player:play", this.play)
	this.listenTo(app.vent, "Player:next", this.next)
	this.listenTo(app.vent, "Player:prev", this.prev)

	/*triggered from YouTube_Player*/
	this.listenTo(app.vent, "YouTube_Player:hide", this.hide_yt)
	this.listenTo(app.vent, "YouTube_Player:show", this.show_yt)
    },

    events : {
	'click #play-play' : 'resume',
	'click #play-pause' : 'pause',
	'click #play-next' : 'next',
	'click #play-prev' : 'prev',
	'click #ytquit' : 'hide_yt'
    },

    render: function() {
	console.log("[PlayerView] render")
	return this;
    },




/*Controls play, pause, etc*/
    play : function(e, time) {
	console.log("[PlayerView] trackplay")

	/*set current track if it was chosen via DOM*/
	if (e != null) {
	    this.current_track = this.playerqueue.find($(e).attr("id"))
	}

	this.updateTrackInfo(this.current_track)

	$('#player').show()

	this.player.play[this.current_track.get("service")](this.player, this.current_track, time)

	if (!this._update_time_interval) {
	    this.refreshTime(this.current_track)
	}

	this.toggle_play_controls()
    },

    pause: function() {
	//clearInterval(this._update_time_interval)
	console.log("[PlayerView] pause")
	this.player.pause()
	this.toggle_pause_controls()
    },

    resume: function() {
	console.log("[PlayerView] resume")
	this.player.resume()
	this.toggle_play_controls()
    },

    seek: function(posX_percent) {
	console.log("[PlayerView] seek " + posX_percent)
	if (this.current_track) {
	    this.player.seek(posX_percent/100 * this.current_track.get("duration"))
	}
    },

    next: function() {
	console.log("[PlayerView] next")

	this.current_track = this.playerqueue.next()
	this.play(null, this.current_track.get("timestamp"))
    },

    prev: function() {
	console.log("[PlayerView] prev")

	var track = this.playerqueue.prev()

	if (track) {
	    this.current_track = track
	    this.play(null, this.current_track.get("timestamp"))
	}
    },

/*GUI-ish & Controls*/
    refreshTime : function() {
	var self = this

	this._update_time_interval = setInterval(function() {

	    var elapsed =  self.player.getElapsed();
	    var elapsed_format = app.Util.time_format(self.current_track.get("service"), elapsed)

	    //update elapsed on player
	    self.update_time(elapsed_format)

	    //update bar
	    self.update_slider(elapsed, self.current_track.get("duration") )

	}, 350)
    },
    update_slider : function(elapsed, duration) {
	if (!this.playerslider.is_busy()) {
	    this.playerslider.moveSlider((elapsed / duration) * 100)
	}
    },
    update_time : function(time) {
	$("#track-time > #elapsed").html(time)
    },
    toggle_play_controls : function() {
	$('#play-play > .fi-play').attr('class', 'fi-pause')
	$('#play-play').attr('id', 'play-pause')
    },
    toggle_pause_controls : function() {
	$('#play-pause > .fi-pause').attr('class', 'fi-play')
	$('#play-pause').attr('id', 'play-play')
    },
    updateTrackInfo : function(track) {
	$('#player > #player-track-meta > #track-info').html( track.get("title") + " | " + track.get("artist") )

	$("#track-time > #duration").html( " / " + track.get("duration_format") )
    },

    show_yt : function () {
	$('#ytquit').css('display', 'block');
	$('#ytplayer').css('left', 'auto')
    },

    hide_yt : function() {
	$('#ytquit').css('display', 'none');
	$('#ytplayer').css('left', '-999rem')
    }

});
