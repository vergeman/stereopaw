var app = app || {};

app.PlaylistsMgr = Backbone.Model.extend({


    initialize: function(session) {
	if (DEBUG)
	    console.log("[PlaylistsMgr] initialize")

	this.playlists = new app.Playlists([], session)
	this.session = session
	this.listenTo(app.vent, "Session:logged-in", this.load)
	this.listenTo(app.vent, "Session:logged-out", this.unload)

	/*pseudo-interface to access & pass
	 *playlist collection between views/models
	 */

	this.listenTo(app.vent, "PlaylistsMgr:SetPlaylist", 
		      this.SetPlaylist)

	this.listenTo(app.vent, "PlaylistsMgr:GetPlaylist", 
		      this.GetPlaylist)

	this.listenTo(app.vent, "PlaylistsMgr:AddtoPlaylist", 
		      this.AddtoPlaylist)

	/*reload / refetch*/
	this.listenTo(app.vent, "PlaylistsMgr:ReloadPlaylist",
		      this.fetch)

	this.init = false
    },

    load : function() {
	if (DEBUG)
	    console.log("[PlaylistsMgr] collection:load")

	if(this.init) {
	    return
	}
	/*this is kinda stupid, 
	 *should hunt down the double-firing 
	 *Session:logged-in event
	 */
	this.init = true

	var user_id = this.session.get("current_user").get("id")

	this.fetch("/users/" + user_id + "/playlists/")
    },

    fetch : function(url) {
	if (DEBUG)
	    console.log("[PlaylistsMgr] fetch")

	this.playlists.set_url(url)

	this.playlists.fetch(
	    {
		add: true,
		remove: false,
		success: function(collection, response, options) {
		    if (DEBUG)
			console.log("[PlaylistsMgr] fetch:success")

		}
	    }
	)
    },

    unload : function() {
	this.playlists.unbind()
    },

/*playlists passed by events*/
    
    SetPlaylist : function(playlist) {
	if (DEBUG)
	    console.log("[PlaylistsMgr] SetPlaylist")

	this.playlists.add(playlist, {merge: true})

	$.growl.notice({ title: "Playlist Updated",
			 message: "Your track was successfully added" });

    },

    GetPlaylist : function(sendTo) {
	if (DEBUG)
	    console.log("[PlaylistsMgr] GetPlaylist")

	app.vent.trigger(sendTo, this.playlists)
    },

    AddtoPlaylist : function(playlist) {
	if (DEBUG)
	    console.log("[PlaylistsMgr] AddtoPlaylist")

	this.playlists.add(playlist)
	$.growl.notice({ title: "Playlist Created",
			message: playlist.name + " is available" });

	app.vent.trigger("PlaylistsMgr:playlist_updated")
    }
});
