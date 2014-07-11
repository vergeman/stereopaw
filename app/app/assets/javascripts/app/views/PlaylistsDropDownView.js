var app = app || {};

app.PlaylistsDropDownView = Backbone.View.extend({

    tagName: 'div',

    className: 'playlists-dropdown',

    template: JST['playlists/dropdown'],

    events : {
	'click .tracks' : 'add_to_tracks',
	'click .create' : 'create',
	'click .playlist-dd' : 'add'
    },

    initialize: function(opts) {
	if (DEBUG)
	    console.log("[PlaylistDropDownView] initialize")

	this.playlists = null;
	this.$track = opts.$track;
	this.displayroute = opts.displayroute;

	this.listenTo(app.vent, 
		      "PlaylistsDropDownView:SetPlaylist", 
		      this.SetPlaylist)

	app.vent.trigger("PlaylistsMgr:GetPlaylist", 
			 "PlaylistsDropDownView:SetPlaylist")

    },

    /*adds to track collection*/
    add_to_tracks : function(e) {
	if (DEBUG)
	    console.log("[PlaylistsDropDownView] add_to_tracks")

	e.preventDefault();

	var data = {'id' : $(e.currentTarget).attr('track_id')}

	$.post('/tracks/add.json',
	       data,
	       //success
	       function(data) {
		   $.growl.notice(
		       {title: "Added",
			message: "Track successfully added to your collection"
		       });
	       }
	      ).fail(function() {
		  if (DEBUG)
		      console.log("[PlaylistsDropDownView] POST error")
		   $.growl.error(
		       {title: "Error",
			message: "There was an error adding the track to your collection"
		       });

	      });

    },

    /*creates playlist*/
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

    /*adds to playlist*/
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
			      app.vent.trigger("PlaylistsMgr:SetPlaylist", response)
			  },
			  error:
			  function(model, xhr, options)
			  {
			      if (DEBUG) {
				  console.log("[PlaylistDropDownView] errors")
				  console.log(model)
				  console.log(xhr)
				  console.log(options)
			      }
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
		track_id: this.$track.attr("id"),
		displayroute: this.displayroute
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
