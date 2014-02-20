var app = app || {}


/* try to keep limited to view & click events */

app.PlayerView = Backbone.View.extend({

    el: '#player',

    initialize: function() {

	console.log("[PlayerView] initialize")

	this.playercontrols = new app.PlayerControlView({el : this.el});
	this.player = new app.Player(this);

	this._update_time_interval = null;
	this.current_track = null;
	this.prev_track = null;
	this.next_track = null;

	/*seek*/
	this.listenTo(app.vent, "Player:seek", this.seek)

	/* next, prev
	 * events called when track is finished, auto move next
	 */
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
	'click #play-prev' : 'prev'
    },


    render: function() {
	console.log("[PlayerView] render")
	return this;
    },

    play : function(e, time) {
	console.log("[PlayerView] trackplay")

	this.current_track = this.getTrackInfo(e)

	this.prev_track = this.getTrackInfo($('#'+ this.current_track.id).parents(".track").prev().children()[0] )
	this.next_track = this.getTrackInfo($('#'+ this.current_track.id).parents(".track").next().children()[0] )

	this.updateTrackInfo(this.current_track)
	$('#player').show()

	this.player.play[this.current_track.service](this.player, this.current_track.track_id, time)


	this.refreshTime(this.current_track)
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
	    this.player.seek(posX_percent/100 * this.current_track.duration)
	}
    },
    next: function() {
	console.log("[PlayerView] next")
	if (!this.next_track || this.next_track.id !== undefined) {
	    this.current_track = this.next_track
	    this.play( $('#' + this.current_track.id), this.current_track.timestamp)
	}
    },
    prev: function() {
	console.log("[PlayerView] prev")
	if (!this.prev_track || this.prev_track.id !== undefined) {
	    this.current_track = this.prev_track
	    this.play( $('#' + this.current_track.id), this.current_track.timestamp)
	}
    },

    refreshTime : function() {
	var self = this

	this._update_time_interval = setInterval(function() {

	    var elapsed =  self.player.getElapsed();
	    var elapsed_format = app.Util.time_format(self.current_track.service, elapsed)

	    //update elapsed on player
	    self.update_time(elapsed_format)

	    //update bar
	    self.update_slider(elapsed, self.current_track.duration)

	}, 350)
    },
    update_slider : function(elapsed, duration) {
	if (!this.playercontrols.is_busy()) {
	    this.playercontrols.moveSlider((elapsed / duration) * 100)
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
    updateTrackInfo : function(track_info) {
	$('#player > #player-track-meta > #track-info').html( track_info.title + " | " + track_info.artist)

	$("#track-time > #duration").html( " / " + track_info.duration_format )
    },
    
    getTrackInfo : function(e) {

	return {
	    id: $(e).attr('id'),
	    track_id : $(e).attr('track_id'),
	    service : $(e).attr('service'),
	    timestamp : $(e).attr('timestamp'),
	    artist: $(e).attr('artist'),
	    title: $(e).attr('title'),
	    duration: $(e).attr('duration'),
	    duration_format: $(e).attr('duration_format')
	}
    },

    show_yt : function () {
	$('#ytplayer').css('left', 'auto')
    },

    hide_yt : function() {
	$('#ytplayer').css('left', '-999rem')
    }

});
