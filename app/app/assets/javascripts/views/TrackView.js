var app = app || {};

/* Track View */

app.TrackView = Backbone.View.extend({

    tagName: 'div',

    className: 'track',

    template: HandlebarsTemplates['tracks/show'],    

    events : {
	'click .play' : 'play',
	'click .stop' : 'stop'
    },

    render: function() {
	console.log("[TrackView] Render")
	this.model.gen_attribute_link();
	this.$el.html( this.template({track : this.model.toJSON()} ));
	
	return this;
    },

    play : function(e) {
	console.log("[TrackView] play")

	var track_id = $(e.currentTarget).attr('track_id')
	var service = $(e.currentTarget).attr('service')
	var timestamp = $(e.currentTarget).attr('timestamp')

	app.player.play[service](app.player, track_id, timestamp)

	if (service == 'youtube') {
	    $('#player').css('display', 'block');
	}
    },

    stop : function(e) {
	console.log("[TrackView] stop")

	app.player.stop()
    }


})

