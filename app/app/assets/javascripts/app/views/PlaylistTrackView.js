var app = app || {}

app.PlaylistTrackView = Backbone.View.extend({

    tagName: 'tr',
    className: 'track',
    template: JST['playlists/tracks_show'],

    initialize: function(model, opts) {
	if (DEBUG)
	    console.log("[PlaylistTrackView] initialize")
	this.listenTo(this.model, "change", this.render)
	this.pid = opts.playlist_id
    },

    events : {
	'click .play' : 'play',
	'click .remove' : 'remove_track'
    },

    remove_track : function(e) {
	if (DEBUG)
	    console.log("[PlaylistTrackView] remove")
	/*likely have cross-tab sync problem if delete on one
	 *tab and don't refresh collection on other tab..
	 */
	var r = confirm("Do you want to remove this track from your playlist?");
	if (!r) {
	    return
	}

	app.vent.trigger("PlaylistTracksView:remove_track", 
			 $(e.currentTarget).attr("pid"),
			 $(e.currentTarget).attr("mid"),
			 $(e.currentTarget).attr("index")
			)

    },

    play : function(e) {
	if (DEBUG)
	    console.log("[PlaylistTrackView] play")

	var $track_meta = $(e.currentTarget)
	var timestamp = $track_meta.attr('timestamp');

	app.vent.trigger("Player:play", $track_meta, timestamp)
    },

    render : function() {
	if (DEBUG)
	    console.log("[PlaylistTrackView] render")
	this.$el.html( this.template(
	    {
		track : this.model.toJSON(),
		cid : this.model.cid, //for player
		pid : this.pid,  //for deleting
		index: this.index //"
	    }
	))
	return this;
    },

    set_index : function(index) {
	this.index = index;
    },

    close : function() {
	if (DEBUG)
	    console.log("[PlaylistTrackView] close")
	this.remove()
	this.unbind()
    }

  

});
