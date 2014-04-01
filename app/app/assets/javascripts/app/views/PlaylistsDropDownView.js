var app = app || {};

app.PlaylistsDropDownView = Backbone.View.extend({

    tagName: 'div',

    className: 'playlists-dropdown',

    template: JST['playlists/dropdown'],

    events : {
	'click .create' : 'create',
	'click a' : 'add'
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

	/*need to keep dropdown link & dropdown content
	 *(li.playlist & .playlist-dropdown) at the same 
	 *level in DOM 
	 */
	$(document).foundation('dropdown', 'close', $('[data-dropdown-content]'));

	/*see PlaylistsModalView*/
	app.vent.trigger("PlaylistsModalView:openModal", "new")
    },

    add : function(e) {
	console.log("[PlaylistsDropDownView] add")
	e.preventDefault();

	var playlist_id = $(e.currentTarget).attr('playlist_id')
	this.submit_add_playlist(this.playlists.url,
				 playlist_id,
				 this.$track.attr('id'))

	Foundation.libs.dropdown.close($('#drop-' + this.$track.attr('id') ))

    },

    submit_add_playlist : function(playlists_url, playlist_id, track_id) {
	console.log("[PlaylistDropDownView] submit_add_playlist")

	$.ajax({
	    type: "PATCH",
	    url: playlists_url + playlist_id,
	    data: {'track' : track_id},
	    beforeSend: function(request) {
		request.setRequestHeader("X-CSRF-Token", $.cookie('csrf_token'));
	    },
	    success: function(data, textStatus, jqXHR) {
		console.log("[PlaylistDropDownView] playlist_submit:success")
		/*Playlists are updated in centralized PlaylistsMgr*/
		if ('errors' in data) {
		    console.log("[PlaylistDropDownView] errors")
		    console.log(data)
		}
		else {
		    app.vent.trigger("PlaylistsMgr:SetPlaylist", data)
		}
	    },

	    error: function(jqXHR, textStatus, errorThrown) {
		console.log("[PlaylistDropDownView] submit:error")
		console.log(textStatus)
		console.log(errorThrown)
		console.log(jqXHR)
	    },

	    complete : function(jqXHR, textStatus) {
		console.log("[PlaylistDropDownView] submit:complete")
	    }
	})
    },

    SetPlaylist : function(playlists) {
	console.log("[PlaylistsDropDownView] SetPlaylist")
	this.playlists = playlists
	this.render()
    },

    render: function() {
	console.log("[PlaylistDropDownView] render " + this.$track.attr("id") )
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
