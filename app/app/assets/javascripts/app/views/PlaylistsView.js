var app = app || {};

app.PlaylistsView = Backbone.View.extend({

    tagName: 'div',

    id: 'content',

    template: JST['playlists/index'],

    initialize: function(playlists) {
	console.log("[PlaylistsView] initialize")

	this._playlistViews = [];

	this.collection = new Backbone.Collection;

	_(this).bindAll('close')

	this.listenTo(this.collection, 'add', this.add_collection)
	this.listenTo(this.collection, 'remove', this.remove_collection)
	this.collection.set(playlists.models)
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
	    this.$el.append(pv.render().el)
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
