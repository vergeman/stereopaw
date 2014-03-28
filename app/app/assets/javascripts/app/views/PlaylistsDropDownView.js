var app = app || {};

app.PlaylistsDropDownView = Backbone.View.extend({

    tagName: 'div',

    className: 'playlists-dropdown',

    template: JST['playlists/dropdown'],

    events : {
	'click .create' : 'create'
    },

    initialize: function($track) {
	console.log("[PlaylistDropDownView] initialize")
	this.playlists = null;
	this.$track = $track;
	this.listenTo(app.vent, 
		      "PlaylistsDropDownView:SetPlaylist", 
		      this.SetPlaylist)

	app.vent.trigger("PlaylistsMgr:GetPlaylist", 
			 "PlaylistsDropDownView:SetPlaylist")

    },

    create : function(e) {
	console.log("[PlaylistsDropDownView] create")
	e.preventDefault();
	var id = $(e.currentTarget).attr('track_id')

	/*need to keep dropdown link & dropdown content
	 *(li.playlist & .playlist-dropdown) at the same 
	 *level in DOM 
	 */
	$(document).foundation('dropdown', 'close', $('[data-dropdown-content]'));

	/*see PlaylistsModalView*/
	app.vent.trigger("PlaylistsModalView:openModal", id)
    },

    SetPlaylist : function(playlists) {
	console.log("[PlaylistsDropDownView] SetPlaylist")
	this.playlists = playlists
	this.render()
    },

    render: function() {
	console.log("[PlaylistDropDownView] render")
	this.$el.html( this.template(
	    {
		playlists: this.playlists.toJSON(),
		track_id: this.$track.attr("id")
	    } 
	));

	return this;
    },

    close: function() {
	console.log("[PlaylistDropDownView] close")
	this.remove()
	this.unbind()
    }
});
