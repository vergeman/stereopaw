var app = app || {};

app.PlaylistsIndexView = Backbone.View.extend({

    tagName: 'div',

    id: 'content',

    template: JST['playlists/index'],

    events : {
	'click .add-playlist' : 'add_playlist'
    },

    initialize: function(playlists) {
	if (DEBUG)
	    console.log("[PlaylistsIndexView] initialize")

	this._playlistViews = [];

	this.collection = new Backbone.Collection;

	_(this).bindAll('close')

	this.listenTo(this.collection, 'add', this.add_collection)
	this.listenTo(this.collection, 'remove', this.remove_collection)
	this.listenTo(app.vent, "PlaylistsMgr:playlist_updated", 
		      this.ask_playlists)

	this.listenTo(app.vent, "PlaylistsIndexView:update_playlists",
		      this.update_playlists)

	this.collection.set(playlists.models)
	
    },

    ask_playlists : function() {
	if (DEBUG)
	    console.log("[PlaylistsIndexView] ask_playlists")
	app.vent.trigger("PlaylistsMgr:GetPlaylist", "PlaylistsIndexView:update_playlists")
    },

    update_playlists : function(playlists) {
	if (DEBUG)
	    console.log("[PlaylistsIndexView] update_playlists")
	this.listenToOnce(this.collection, "add", 
			  this.render_updated)
	this.collection.set(playlists.models)
    },
    render_updated : function() {
	if (DEBUG)
	    console.log("[PlaylistsIndexView] render-updated")
	pv = this._playlistViews[(this._playlistViews.length-1)]
	this.$el.find('.playlist-wrap').append(pv.render().el)
    },

    add_playlist : function(e) {
	if (DEBUG)
	    console.log("[PlaylistsIndexView] add_playlists")
	e.preventDefault()
	
	/*see PlaylistsModalView*/
	app.vent.trigger("PlaylistsModalView:openModal", "new")	
    },

    add_collection : function(model) {
	if (DEBUG)
	    console.log("[PlaylistsIndexView] add")
	var pv = new app.PlaylistView(
	    {
		model : model
	    }
	)

	this._playlistViews.push(pv)
    },

    remove_collection: function(model) {
	if (DEBUG)
	    console.log("[PlaylistsIndexView] remove")
	var pv_remove = _(this._playlistViews).select(function(pv) {
	    return pv.model === model;})[0];
	this._playlistViews = _(this._playlistViews).without(pv_remove);
	pv_remove.close;

    },

    render : function() {
	if (DEBUG)
	    console.log("[PlaylistsIndexView] render")
	$(window).scrollTop(0);

	//loop each playlistView & render
	this.$el.append(this.template())

	_(this._playlistViews).each(function(pv) {
	    this.$el.find('.playlist-wrap').append(pv.render().el)
	}, this);


	return this;	
    },

    close: function() {
	if (DEBUG)
	    console.log("[PlaylistsIndexView] close")
	_(this._playlistViews).each(function(pv) {
	    pv.close()
	});

	this._playlistViews.length = 0
	this.collection.reset()
	this.remove()
	this.unbind()
    }
});
