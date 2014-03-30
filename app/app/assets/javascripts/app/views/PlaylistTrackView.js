var app = app || {}

app.PlaylistTrackView = Backbone.View.extend({

    tagName: 'tr',
    className: 'track',
    template: JST['playlists/tracks_show'],

    initialize: function(model, opts) {
	console.log("[PlaylistTrackView] initialize")
	this.listenTo(this.model, "change", this.render)
    },

    events : {
	'click .play' : 'play'
    },

    play : function(e) {
	console.log("[PlaylistTrackView] play")
	var time = $(e.currentTarget).attr('timestamp');

	app.vent.trigger("Player:play", $(e.currentTarget), time)
    },

    render : function() {
	console.log("[PlaylistTrackView] render")
	this.$el.html( this.template(
	    {
		track : this.model.toJSON(),
		cid : this.model.cid
	    }
	))
	return this;
    },

    close : function() {
	console.log("[PlaylistTrackView] close")
	this.remove()
	this.unbind()
    }

  

});
