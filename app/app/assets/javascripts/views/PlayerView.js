var app = app || {}

app.PlayerView = Backbone.View.extend({


    el: '#player',

    initialize: function() {

	console.log("[PlayerView] initialize")
	this.player = new app.Player(this);
    },


    events : {},


    render: function() {
	console.log("[PlayerView] render")
	return this;
    },

    play : function(e, time) {
	console.log("[TrackView] trackplay")
	console.log(e)
	var track_info = this.getTrackInfo(e)

	this.player.play[track_info.service](this.player, track_info.track_id, time)

	this.updateTrackInfo(track_info)
	$('#play-play > .fi-play').attr('class', 'fi-pause')

    },
    clear_youtube : function() {
	$('#play-play > .fi-pause').attr('class', 'fi-play')
	$("#ytplayer").fadeOut();

    },
    render_youtube : function() {
	$("#ytplayer").fadeIn();
    },



    /*Utility functions*/
    updateTrackInfo : function(track_info) {
	$('#player > #track-meta > #track-info').html( track_info.artist + " | " + track_info.title)	
	$('#track-starttime').html( "0:00" )
	$('#track-endtime').html( track_info.duration )

    },
    
    getTrackInfo : function(e) {

	return { 
	    track_id : $(e).attr('track_id'),
	    service : $(e).attr('service'),
	    timestamp : $(e).attr('timestamp'),
	    artist: $(e).attr('artist'),
	    title: $(e).attr('title'),
	    duration: $(e).attr('duration')
	}
    }

});
