
var app = app || {};

/* Track View */

app.TrackView = Backbone.View.extend({

    tagName: 'div',

    className: 'track',

    template: JST['tracks/show'],    

    initialize: function(opts) {
	this.listenTo(this.model, "change", this.render)
	this.editable = opts.editable
	this.playlistable = opts.playlistable
    },

    events : 
    {
	'click .play' : 'play',
	'click .stop' : 'stop',
	'click .playlist' : 'playlist'
    },

    render: function() {
	/* we pass track_age separately, as rails seems 
	 * to have trouble rendering template if we generate
	 * an attribute outside of what's persisted
	 *
	 * this.model & this.editable are passed as args in 
	 * TracksView:add_collection()
	 */
	this.$el.html( this.template(
	    {
		track: this.model.toJSON(),
		track_age: this.model.get("age"),
		editable: this.editable,
		playlistable : this.playlistable
	    }
	));
	
	return this;
    },

    play : function(e) {
	console.log("[TrackView] play")

	var time = $(e.currentTarget).attr('timestamp');

	app.vent.trigger("Player:play", $(e.currentTarget).parents('.track-meta'), time)

    },

    stop : function() {
	console.log("[TrackView] stop")
    },

    playlist : function(e) {
	console.log("[TrackView] playlist")
	var $track = $(e.currentTarget).closest('.track-meta')

	if (!this.playlistdropdown) {
	    this.playlistdropdown = new app.PlaylistsDropDownView($track) 
	    this.$el.find('.playlists-dropdown').replaceWith(this.playlistdropdown.el)
	}
	else {
	    app.vent.trigger("PlaylistsMgr:GetPlaylist", 
			     "PlaylistsDropDownView:SetPlaylist")
	}
    },

    close : function() {
	console.log("[TrackView] close")

	if (this.playlistdropdown) {
	    this.playlistdropdown.close()
	}

	this.remove()
	this.unbind()
    }
})

