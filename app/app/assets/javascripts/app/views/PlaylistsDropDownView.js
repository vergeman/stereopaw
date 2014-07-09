var app = app || {};

app.PlaylistsDropDownView = Backbone.View.extend({

    tagName: 'div',

    className: 'playlists-dropdown',

    template: JST['playlists/dropdown'],

    events : {
	'click .create' : 'create',
	'click .playlist-dd' : 'add'
    },

    initialize: function($track) {
	if (DEBUG)
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
	if (DEBUG)
	    console.log("[PlaylistsDropDownView] create")

	e.preventDefault();

	/*need to keep dropdown link & dropdown content
	 *(li.playlist & .playlist-dropdown) at the same 
	 *level in DOM 
	 */

	/*see PlaylistsModalView*/
	app.vent.trigger("PlaylistsModalView:openModal", "new")
    },

    add : function(e) {
	if (DEBUG)
	    console.log("[PlaylistsDropDownView] add")

	e.preventDefault();

	var playlist_id = $(e.currentTarget).attr('playlist_id')
	this.submit_add_playlist(this.playlists.url,
				 playlist_id,
				 this.$track.attr('id'))

	if (DEBUG)
	    console.log('#drop-' + this.$track.attr('id'))

	$('#drop-' + this.$track.attr('id') ).foundation('reveal', 'close');
    },

    submit_add_playlist : function(playlists_url, playlist_id, track_id) {
	if (DEBUG)
	    console.log("[PlaylistDropDownView] submit_add_playlist")

	var playlist = this.playlists.get(playlist_id)
	var track_ids = _.clone( playlist.get('track_ids') )
	track_ids.push(parseInt(track_id))

	playlist.save({'track_ids' : track_ids}, 
		      {
			  patch:true,
			  success: 
			  function(model, response, options)
			  {
			      console.log("SUCCESS")
			      app.vent.trigger("PlaylistsMgr:SetPlaylist", response)
			  },
			  error:
			  function(model, xhr, options)
			  {
			      if (DEBUG)
				  console.log("[PlaylistDropDownView] errors")
			      if (DEBUG)
				  console.log(xhr)
			  }
		      }
		     )
    },

    SetPlaylist : function(playlists) {
	if (DEBUG)
	    console.log("[PlaylistsDropDownView] SetPlaylist")
	this.playlists = playlists
	this.render()
    },

    render: function() {
	if (DEBUG)
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
	if (DEBUG)
	    console.log("[PlaylistDropDownView] close")
	this.remove()
	this.unbind()
    }
});
