var app = app || {};

app.PlaylistsModalView = Backbone.View.extend({


    tagName: 'div',

    id: 'playlistModal',

    template_new: JST['playlists/playlist_new_modal'],
    template_edit: JST['playlists/playlist_edit_modal'],

    initialize: function(session) {
	if (DEBUG)
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
	if (DEBUG)
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
	if (DEBUG)
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

    /*foundation fix for weird bg/css undefined errors*/
    reset_modal : function(div) {
	$(div).data('reveal-init', {
	    animation: 'fadeAndPop',
	    animation_speed: 250,
	    close_on_background_click: false,
	    close_on_esc: false,
	    dismiss_modal_class: 'close-reveal-modal',
	    bg_class: 'reveal-modal-bg',
	    bg : $('.reveal-modal-bg'),
	    css : {
		open : {
		    'opacity': 0,
		    'visibility': 'visible',
		    'display' : 'block'
		},
		close : {
		    'opacity': 1,
		    'visibility': 'hidden',
		    'display': 'none'
		}
	    }
	});

    },


    /*
     *clears, toggles modal, sets submit handler 
     *to create playlist
     *lots of problems with foundation and sharing modals
     *this sequence seems to work
     */
    playlist_openModal : function(type, playlist) {
	if (DEBUG)
	    console.log("[PlaylistsModalView] playlist_openModal")
	if (DEBUG)
	    console.log(playlist)

	this.render(type, playlist)

	/*open modal*/
	this.reset_modal("#PlaylistModal")

	$(document).on('open', '[data-reveal]', function () {
	    $('.reveal-modal-bg').hide()
	})

	$('#PlaylistModal').foundation('reveal', 'open');

	$(document).on('opened', '[data-reveal]', function () {
	    $('.reveal-modal-bg').show()
	    $('.reveal-modal-bg').click(function() {
		$('#PlaylistModal').foundation('reveal', 'close')
	    })
	});

	/*bind submit*/

	//weird foundation bug
	$('.close-reveal-modal').one('click', function(e) {
	    $('#PlaylistModal').foundation('reveal', 'close')
	    $('.reveal-modal-bg').remove()
	})

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
		description : $("textarea#playlist_description").val(),
		track_ids : this.playlist.get("track_ids")
	    }
	}

    },

    build_type : function() {
	return (this.type == "new") ? "POST" : "PATCH"
    },

    /*submit form handler to create playlist*/
    playlist_submit : function() {
	if (DEBUG)
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
		if (DEBUG)
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
		if (DEBUG)
		    console.log("[PlaylistsModalView] submit:error")
		if (DEBUG)
		    console.log(textStatus)
		if (DEBUG)
		    console.log(errorThrown)
		if (DEBUG)
		    console.log(jqXHR)
	    },

	    complete : function(jqXHR, textStatus) {
		if (DEBUG)
		    console.log("[PlaylistsModalView] submit:complete")
		app.vent.trigger("PlaylistTracksView:refresh")
	    }
	})
    },

    /*garbage collect*/
    close : function() {
	if (DEBUG)
	    console.log("[PlaylistsModalView] close")
	this.unbind()
	this.remove()
    },

});
