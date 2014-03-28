var app = app || {};

app.PlaylistsModalView = Backbone.View.extend({


    tagName: 'div',

    id: 'playlistModal',

    template: JST['playlists/playlist_modal'],

    initialize: function(session) {
	console.log("[PlaylistsModalView] initialize")

	this.session = session
	this.user_id = null
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

    /*renders modal div with appropriate submit url*/
    render: function() {
	console.log("[PlaylistsModalView] render")
	this.$el.html(
	    this.template(
		{ 
		    user_id: this.user_id,
		    authenticity_token: $.cookie('csrf_token')
		} 
	    ))

	return this;
    },

    /*clear modal previously sent*/
    clear_modal: function() {
	$('input#playlist_name, input#playlist_description').val("")
	$('.error_name, .error_playlist_description, .error_general').html('')
	$('.error').removeClass('error')
    },

    /*clears, toggles modal, sets submit handler 
     *to create playlist
     */
    playlist_openModal : function(id) {
	console.log("[PlaylistsModalView] playlist_openModal")

	this.clear_modal()

	/*open modal*/
	$('#PlaylistModal').foundation('reveal', 'open');

	var self = this;
	$('#playlist_submit').click(function(e) {
	    e.preventDefault()
	    self.playlist_submit()
	});

    },

    /*
     *builds form data obj to create playlist
     */
    build_data : function() {
	return {
	    playlist : {
		name: $("input#playlist_name").val(),
		description : $("input#playlist_description").val()
	    }
	}
    },

    /*submit form handler to create playlist*/
    playlist_submit : function() {
	console.log("[PlaylistsModalView] playlist_submit")
	//send post
	var self = this;
	$.ajax({
	    type: "POST",
	    url: "/users/" + self.user_id + "/playlists",
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
		    /*open modal and update playlist mgr w/ 
		     *new data
		     */
		    $('#PlaylistModal').foundation('reveal', 'close');
		    app.vent.trigger("PlaylistsMgr:AddtoPlaylist", data)
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
