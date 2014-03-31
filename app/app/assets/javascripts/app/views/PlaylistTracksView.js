var app = app || {};

app.PlaylistTracksView = Backbone.View.extend({

    tagName: 'div',

    id: 'content',

    className: 'playlistTracks',

    template: JST['playlists/tracks_index'],

    events : {
	'click .edit-playlist' : 'edit_playlist',
	'click .delete-playlist' : 'delete_playlist'
    },

    initialize: function(models, opts) {
	console.log("[PlaylistTracksView] initialize")

	/*_pltv array keeps references to views*/
	this._pltv = []
	
	this.playlist = opts.playlist

	/*trackscollection: collection of unique
	 *tracks in a placelist
	 */
	this.trackscollection = new app.Tracks()
	this.trackscollection.url = this.playlist.url()
	this.fetch_tracks()

	/*playlistTracks: actual playlist - a generated 
	 *track list from playlist to allow for duplicates. 
	 *record attribute change: id -> mid.
	 */
	this.playlistTracks = new app.Tracks()

	this.listenTo(this.playlistTracks, 'add', this.add_collection)
	this.listenTo(this.playlistTracks, 'remove', this.remove_collection)

	this.listenTo(app.vent, "PlaylistTracksView:remove_track",
		      this.remove_track)

	this.listenTo(app.vent, "PlaylistTracksView:refresh", 
		      this.refresh)

	_(this).bindAll('close')
    },

    edit_playlist : function(e) {
	console.log("[PlaylistTracksView] edit_playlist")
	e.preventDefault()

	app.vent.trigger("PlaylistsModalView:openModal",
			 "edit", this.playlist)
    },

    delete_playlist : function(e) {
	console.log("[PlaylistTracksView] delete_playlist")
	e.preventDefault()

	var r = confirm("Are you sure you want to delete this playlist?");
	if (!r) {
	    return
	}

	var success = function() {
	    Backbone.history.navigate("/playlists", {trigger:true})
	}

	this.playlist.destroy(
	    {
		success: success,
		error : function() {
		    console.log("[PlaylistTracksView] error deleting playlist")
		}
	    }
	);
    },

    fetch_tracks : function() {
	var self = this;
	var success = function() { 
	    self.update_playlist_tracks()
	}

	this.trackscollection.fetch(
	    {success : success}
	)	
    },

    /*refresh - we remove all and put back
     *inefficient, but consistent - could have deleted from
     * middle of playlist, refreshing indices are work to maintain
     */
    refresh : function() {
	this.playlistTracks.remove( this.playlistTracks.models )
	this.update_playlist_tracks()
    },

    remove_track : function(pid, mid, index) {
	console.log("[PlaylistTracksView] remove_track")
	m =  this.playlistTracks.at(index)

	var track_ids = this.playlist.get("track_ids")
	track_ids.splice(index,1)
	this.playlist.set("track_ids", track_ids)

	console.log(this.playlist)

	this.refresh()

	this.playlist.save()

    },

    /*
     * update_playlist_tracks builds playlist from unique 
     * list of tracks and track_ids in the playlist
     */
    update_playlist_tracks : function() {
	console.log("[PlaylistTracksView] update_playlist_tracks")

	_(this.playlist.get("track_ids") ).each( function(tid) {
	    var model = this.trackscollection.get(tid).toJSON()
	    model.mid = model.id
	    delete model.id
	    this.playlistTracks.add([model])    
	}, this);

	app.vent.trigger("PlayerQueue:update",
			 this.playlist.url, this.playlistTracks)
	this.render()
    },

    add_collection : function(model) {
	console.log("[PlaylistTracksView] add_collection")
	var pltv = new app.PlaylistTrackView(
	    {model : model},
	    {playlist_id : this.playlist.get("id")}
	)
	this._pltv.push(pltv)
	
	pltv.set_index(this._pltv.length - 1)
    },

    remove_collection: function(model) {
	console.log("[PlaylistTracksView] remove_collection")
	var pltv_remove = _(this._pltv).select(function(pltv) { return pltv.model === model; })[0];
	console.log("HERE")
	console.log(pltv_remove)
	this._pltv = _(this._pltv).without(pltv_remove);
	pltv_remove.close()
    },


    render: function() {
	console.log("[PlaylistTracksView] render")

	this.$el.html( this.template({playlist: this.playlist.toJSON()}) )

	_(this._pltv).each(function(pltv) {
	    this.$el.find('tbody').append(pltv.render().el)
	}, this);

	return this;
    },

    close: function() {
	console.log("[PlaylistTracksView] close")

	_(this._pltv).each( function(pltv) {
	    pltv.close()
	});
	    
	this.remove()
	this.unbind()
    }


})
