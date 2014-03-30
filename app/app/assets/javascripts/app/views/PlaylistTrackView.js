var app = app || {}

app.PlaylistTrackView = Backbone.View.extend({

    tagName: 'tr',
    className: 'track',
    template: JST['playlists/tracks_show'],

    initialize: function(model, opts) {
	console.log("[PlaylistTrackView] initialize")
	this.listenTo(this.model, "change", this.render)
	
    },

    events : {},

    render : function() {
	console.log("[PlaylistTrackView] render")
	this.$el.html( this.template(
	    {track : this.model.toJSON() }
	))
	return this;
    },

    close : function() {
	console.log("[PlaylistTrackView] close")
	this.remove()
	this.unbind()
    }

  

});
