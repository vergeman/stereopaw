var app = app || {}


/* try to keep limited to view & click events */

app.PlayerView = Backbone.View.extend({


    el: '#player',

    initialize: function() {

	console.log("[PlayerView] initialize")
	this.player = new app.Player(this);

	/*triggered from YouTube_Player*/
	app.vent.on("YouTube_Player:hide", this.hide_yt, this)
	app.vent.on("YouTube_Player:show", this.show_yt, this)
    },


    events : {},


    render: function() {
	console.log("[PlayerView] render")
	return this;
    },

    play : function(e, time) {
	console.log("[PlayerView] trackplay")
	console.log(e)
	var track_info = this.getTrackInfo(e)

	this.player.play[track_info.service](this.player, track_info.track_id, time)

	this.updateTrackInfo(track_info)
	$('#play-play > .fi-play').attr('class', 'fi-pause')

    },

    pause: function() {},
    resume: function() {},
    seek: function() {},
    next: function() {},
    prev: function() {},

    show_yt : function () {
	$('#ytplayer').css('left', 'auto')
    },

    hide_yt : function() {
	$('#ytplayer').css('left', '-999rem')
    },

    /*Utility functions*/
    updateTrackInfo : function(track_info) {
	$('#player > #player-track-meta > #track-info').html( track_info.title + " | " + track_info.artist)

	console.log(track_info.duration_format);
	$("#track-time > #duration").html( " / " + track_info.duration_format )
    },
    
    getTrackInfo : function(e) {

	return { 
	    track_id : $(e).attr('track_id'),
	    service : $(e).attr('service'),
	    timestamp : $(e).attr('timestamp'),
	    artist: $(e).attr('artist'),
	    title: $(e).attr('title'),
	    duration: $(e).attr('duration'),
	    duration_format: $(e).attr('duration_format')
	}
    }

});
