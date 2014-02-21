var app = app || {};

/* Track View */

app.TrackView = Backbone.View.extend({

    tagName: 'div',

    className: 'track',

    template: HandlebarsTemplates['tracks/show'],    

    events : 
    {
	'click .play' : 'play',
	'click .stop' : 'stop'
    },

    render: function() {
	console.log("[TrackView] Render")
	this.$el.html( this.template({track : this.model.toJSON()} ));
	
	return this;
    },

    play : function(e) {
	console.log("[TrackView] play")

	var time = $(e.currentTarget).attr('timestamp');

	app.vent.trigger("Player:play", $(e.currentTarget).parents('.track-meta'), time)

    },
    stop : function() {
	console.log("[TrackView] stop")
    }
})

