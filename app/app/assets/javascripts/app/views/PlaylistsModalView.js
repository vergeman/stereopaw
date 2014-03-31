var app = app || {};

app.PlaylistsModalView = Backbone.View.extend({


    tagName: 'div',

    id: 'playlistModal',

    template_new: JST['playlists/playlist_new_modal'],
    template_edit: JST['playlists/playlist_edit_modal'],

    initialize: function(session) {
	console.log("[PlaylistsModalView] initialize")

	this.session = session
	this.user_id = null
	this.type = null
	this.playlist = null

	this.listenTo(app.vent, "Session:logged-in", this.set_user_id)
	this.listenTo(app.vent, "Session:logged-out", this.clear_user_id)


	this.listenTo(app.vent,
		      "PlaylistsModalView:openModal",
		      this.playlist_openModal)

	this.listenTo(app.vent,
		      "PlaylistsModalView:submit:error",
		      app.Util.show_error)
    },

    set_user_id : function() {
	console.log("[PlaylistsModalView] set_user_id")
	this.user_id = this.session.get("current_user").get("id")
    },

    clear_user_id: function() {
	this.user_id = null
    },

    update_playlist : function(playlist) {
	this.playlist = playlist
    },

    /*renders modal div with appropriate submit url*/
    render: function(type, playlist) {
	console.log("[PlaylistsModalView] render")

	//type is new or edit 
	this.type = type

	//if type is new, no playlist (null)
	this.playlist = playlist

	var obj = { 
	    type : type,
	    user_id: this.user_id,
	    authenticity_token: $.cookie('csrf_token'),
	    playlist: playlist
	} 

	if (type == "new") {
	    this.$el.html(this.template_new( obj) )
	}
	else {
	    this.$el.html(this.template_edit( obj) )
	}

	return this;
    },

    /*clears, toggles modal, sets submit handler 
     *to create playlist
     */
    playlist_openModal : function(type, playlist) {
	console.log("[PlaylistsModalView] playlist_openModal")
	console.log(playlist)
	this.render(type, playlist)

	$(document).foundation()

	/*weird foundation bug*/
	$('.close-reveal-modal').one('click', function(e) {
	    $('#PlaylistModal').foundation('reveal', 'close')
	    $('.reveal-modal-bg').remove()
	})

	/*open modal*/
	$('#PlaylistModal').foundation('reveal', 'open');

	/*bind submit*/
	var self = this;
	$('#playlist_submit').click(function(e) {
	    e.preventDefault()
	    self.playlist_submit()
	});
    },

    build_url : function() {
	if (this.type == "new") {
	    return "/users/" + this.user_id + "/playlists"
	}
	//type: edit
	return "/users/" + this.user_id + 
	    "/playlists/" + this.playlist.get("id")
    },

    /*
     *builds form data obj to create playlist
     */
    build_data : function() {
	return {
	    playlist : {
		name: $("input#playlist_name").val(),
		description : $("textarea#playlist_description").val()
	    }
	}

    },

    build_type : function() {
	return (this.type == "new") ? "POST" : "PATCH"
    },

    /*submit form handler to create playlist*/
    playlist_submit : function() {
	console.log("[PlaylistsModalView] playlist_submit")
	//send post
	var self = this;
	$.ajax({
	    type: self.build_type(),
	    url: self.build_url(),
	    data: self.build_data(),
	    beforeSend: function(request) {
		request.setRequestHeader("X-CSRF-Token", $.cookie('csrf_token'));
	    },
	    success: function(data, textStatus, jqXHR) {
		console.log("[PlaylistsModalView] playlist_submit:success")
		if ('errors' in data) {		      
		    app.vent.trigger("PlaylistsModalView:submit:error", data.errors)
		}
		else {
		    /* 
		     *close modal and update playlist mgr w/ 
		     *new data
		     */
		    $('#playlist_submit').unbind('click')

		    $(document).foundation()

		    /*bug: second open of playlistsmodal*/
		    $('#PlaylistModal').foundation('reveal', 'close');
		    $('.reveal-modal-bg').remove()

		    if (self.type == "new") {
			app.vent.trigger("PlaylistsMgr:AddtoPlaylist", data)
		    }
		    else {
			app.vent.trigger("PlaylistsMgr:SetPlaylist", data)
		    }
		}
	    },

	    error: function(jqXHR, textStatus, errorThrown) {
		console.log("[PlaylistsModalView] submit:error")
		console.log(textStatus)
		console.log(errorThrown)
		console.log(jqXHR)
	    },

	    complete : function(jqXHR, textStatus) {
		console.log("[PlaylistsModalView] submit:complete")
		app.vent.trigger("PlaylistTracksView:refresh")
	    }
	})
    },

    /*garbage collect*/
    close : function() {
	console.log("[PlaylistsModalView] close")
	this.unbind()
	this.remove()
    },

});