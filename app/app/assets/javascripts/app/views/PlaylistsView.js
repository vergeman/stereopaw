var app = app || {}

app.PlaylistsView = Backbone.View.extend({

    tagname: 'div',

    className: 'playlist-wrap',

    initialize : function(playlists) {
	if (DEBUG)
	    console.log("[PlaylistView] initialize")

	this._playlistViews = [];

	this.collection = new Backbone.Collection;

	_(this).bindAll('close')

	this.listenTo(this.collection, 'add', this.add_collection)
	this.listenTo(this.collection, 'remove', this.remove_collection)
	this.listenTo(app.vent, "PlaylistsMgr:playlist_updated", 
		      this.ask_playlists)

	this.listenTo(app.vent, "PlaylistsView:update_playlists",
		      this.update_playlists)

	this.collection.set(playlists.models)

    },

    reset : function(models) {
	if (DEBUG)
	    console.log("[PlaylistsView] reset")

	this.collection.set(models)
	this.render()
    },

    render : function() {
	if (DEBUG)
	    console.log("[PlaylistsView] render")

	$(window).scrollTop(0);

	_(this._playlistViews).each(function(pv) {
	    this.$el.append(pv.render().el)
	}, this);

	return this;
    },

    ask_playlists : function() {
	if (DEBUG)
	    console.log("[PlaylistsView] ask_playlists")
	app.vent.trigger("PlaylistsMgr:GetPlaylist", "PlaylistsView:update_playlists")
    },

    update_playlists : function(playlists) {
	if (DEBUG)
	    console.log("[PlaylistsView] update_playlists")
	this.listenToOnce(this.collection, "add", 
			  this.render_updated)
	this.collection.set(playlists.models)
    },

    render_updated : function() {
	if (DEBUG)
	    console.log("[PlaylistsView] render-updated")
	pv = this._playlistViews[(this._playlistViews.length-1)]

	this.$el.append(pv.render().el)
    },

    add_collection : function(model) {
	if (DEBUG)
	    console.log("[PlaylistsView] add")

	var pv = new app.PlaylistView(
	    {
		model : model
	    }
	)

	this._playlistViews.push(pv)
    },

    remove_collection: function(model) {
	if (DEBUG)
	    console.log("[PlaylistsView] remove")
	var pv_remove = _(this._playlistViews).select(function(pv) {
	    return pv.model === model;})[0];
	this._playlistViews = _(this._playlistViews).without(pv_remove);
	pv_remove.close;

    },

    close: function() {
	_(this._playlistViews).each(function(pv) {
	    pv.close()
	});

	this._playlistViews.length = 0
	this.collection.reset()
	this.remove()
	this.unbind()
    }



})
