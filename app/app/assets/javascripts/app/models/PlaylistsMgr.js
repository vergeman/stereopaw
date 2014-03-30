var app = app || {};

app.PlaylistsMgr = Backbone.Model.extend({


    initialize: function(session) {
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

	this.init = false
    },

    load : function() {
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
	this.playlists.set_url("/users/" + user_id + "/playlists/")

	this.playlists.fetch(
	    {
		add: true,
		remove: false,
		success: function(collection, response, options) {
		    console.log("[PlaylistsMgrView] fetched")
		}
	    }
	)
    },

    unload : function() {
	this.playlists.unbind()
    },

    /*playlists passed by events*/
    SetPlaylist : function(playlist) {
	console.log("[PlaylistsMgr] SetPlaylist")
	this.playlists.add(playlist,{ merge: true})
    },

    GetPlaylist : function(sendTo) {
	console.log("[PlaylistsMgr] GetPlaylist")
	app.vent.trigger(sendTo, this.playlists)
    },

    AddtoPlaylist : function(model) {
	console.log("[PlaylistsMgr] AddtoPlaylist")
	this.playlists.add(model)
	app.vent.trigger("PlaylistsMgr:playlist_updated")
    }
});
