var app = app || {}


/* try to keep limited to view & click events */

app.PlayerView = Backbone.View.extend({

    el: '#player',

    /*playerview - tracks_collection needed for internal queue*/
    initialize: function(tracks_collection) {

	console.log("[PlayerView] initialize")

	this.playercontrols = new app.PlayerControlView({el : this.el})

	this.player = new app.Player(this);

	this._update_time_interval = null;

	//tracks_collection.fetch({reset:true})

	this.track_queue = tracks_collection;

	//Backbone Track obj
	this.current_track = this.track_queue.at(0);

	/*seek*/
	this.listenTo(app.vent, "Player:seek", this.seek)

	/* next, prev, play
	 * onclick, or when
	 * events called on finished track, auto move next
	 */
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
	'click #play-prev' : 'prev'
    },


    render: function() {
	console.log("[PlayerView] render")
	return this;
    },

    /*next/prev are set to wrap around*/
    set_next_track : function() {
	/* note: id could be slug or num */
	var current_index = this.track_queue.indexOf(this.current_track)
	var next_index  = (current_index + 1) % this.track_queue.length

	this.next_track = this.track_queue.at(next_index)
    },

    set_prev_track : function() {
	/* note: id could be slug or num */
	var current_index = this.track_queue.indexOf(this.current_track)
	var prev_index;
	if (current_index <= 0) {
	    prev_index = this.track_queue.length - 1
	}
	else { 
	    prev_index = current_index - 1
	}

	this.prev_track = this.track_queue.at(prev_index)

    },

    play : function(e, time) {
	console.log("[PlayerView] trackplay")
	console.log(this)
	console.log(this.track_queue)
	/*set current track if it was chosen via DOM*/
	if (e != null) {
	    this.current_track = this.track_queue.get($(e).attr("id"))
	}

	this.set_prev_track()
	this.set_next_track()

	this.updateTrackInfo(this.current_track)
	$('#player').show()

	this.player.play[this.current_track.get("service")](this.player, this.current_track.get("track_id"), time)

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
	    this.player.seek(posX_percent/100 * this.current_track.get("duration"))
	}
    },
    next: function() {
	console.log("[PlayerView] next")
	this.current_track = this.next_track
	this.play(null, this.current_track.get("timestamp"))
    },
    prev: function() {
	console.log("[PlayerView] prev")
	this.current_track = this.prev_track
	this.play(null, this.current_track.get("timestamp"))
    },

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
    updateTrackInfo : function(track) {
	$('#player > #player-track-meta > #track-info').html( track.get("title") + " | " + track.get("artist") )

	$("#track-time > #duration").html( " / " + track.get("duration_format") )
    },
    
    show_yt : function () {
	$('#ytplayer').css('left', 'auto')
    },

    hide_yt : function() {
	$('#ytplayer').css('left', '-999rem')
    }

});
