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

	this.playlistsView = new app.PlaylistsView(playlists)
    },

    add_playlist : function(e) {
	if (DEBUG)
	    console.log("[PlaylistsIndexView] add_playlists")
	e.preventDefault()
	
	/*see PlaylistsModalView*/
	app.vent.trigger("PlaylistsModalView:openModal", "new")	
    },

    render : function() {
	if (DEBUG)
	    console.log("[PlaylistsIndexView] render")

	//render header
	this.$el.append(this.template())

	this.$el.append(this.playlistsView.render().el)

	return this;	
    },

    close: function() {
	if (DEBUG)
	    console.log("[PlaylistsIndexView] close")

	this.playlistsView.close()

	this.remove()
	this.unbind()
    }
});
