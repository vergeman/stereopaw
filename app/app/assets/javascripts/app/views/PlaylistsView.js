var app = app || {};

app.PlaylistsView = Backbone.View.extend({

    tagName: 'div',

    id: 'content',

    template: JST['playlists/index'],

    events : {
	'click .add-playlist' : 'add_playlist'
    },

    initialize: function(playlists) {
	console.log("[PlaylistsView] initialize")

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

    ask_playlists : function() {
	console.log("[PlaylistsView] ask_playlists")
	app.vent.trigger("PlaylistsMgr:GetPlaylist", "PlaylistsView:update_playlists")
    },

    update_playlists : function(playlists) {
	console.log("[PlaylistsView] update_playlists")
	this.listenToOnce(this.collection, "add", 
			  this.render_updated)
	this.collection.set(playlists.models)
    },
    render_updated : function() {
	console.log("[PlaylistsView] render-updated")
	pv = this._playlistViews[(this._playlistViews.length-1)]
	this.$el.find('.playlist-wrap').append(pv.render().el)
    },

    add_playlist : function(e) {
	console.log("[PlaylistsView] add_playlists")
	e.preventDefault()
	
	/*see PlaylistsModalView*/
	app.vent.trigger("PlaylistsModalView:openModal")	
    },

    add_collection : function(model) {
	console.log("[PlaylistView] add")
	var pv = new app.PlaylistView(
	    {
		model : model
	    }
	)

	this._playlistViews.push(pv)
    },

    remove_collection: function(model) {
	console.log("[PlaylistView] remove")
	var pv_remove = _(this._playlistViews).select(function(pv) {
	    return pv.model === model;})[0];
	this._playlistViews = _(this._playlistViews).without(pv_remove);
	pv_remove.close;

    },

    render : function() {
	console.log("[PlaylistsView] render")
	$(window).scrollTop(0);

	//loop each playlistView & render
	this.$el.append(this.template())

	_(this._playlistViews).each(function(pv) {
	    this.$el.find('.playlist-wrap').append(pv.render().el)
	}, this);


	return this;	
    },

    close: function() {
	console.log("[PlaylistsView] close")
	_(this._playlistViews).each(function(pv) {
	    pv.close()
	});

	this._playlistViews.length = 0
	this.collection.reset()
	this.remove()
	this.unbind()
    }
});
