var app = app || {};

app.EditTrackView = Backbone.View.extend({


    tagName: 'div',
    id: 'content',

    template: JST['tracks/edit'],    

    initialize: function(opts) {
	if (DEBUG)
	    console.log("[EditTrackView] initialize")

	this.session = opts.session

	this.model = new app.Track()
	this.model.urlRoot = this._gen_url(opts.user_id)
	this.model.id = opts.track_id

	this.listenTo(this.model, "change", this.validmodelcheck)

	this.listenTo(app.vent,
		      "EditTrackView:error",
		      app.Util.show_error)

	this.model.fetch()

	_(this).bindAll('close')
    },

    _gen_url : function(user_id) {
	return "/users/" + user_id + "/tracks/"
    },
    
    events: {
	'click input[type=submit]#track_submit' : 'submit_edit_track',
	'click .cancel' : 'delete_track'
    },

    /* makes sure we receive a valid model 
     * before we actually render */
    validmodelcheck : function() {
	if (DEBUG)
	    console.log("[EditTrackView] validmodelcheck")

	if (this.model.get("errors")) {
	    if (DEBUG)
		console.log("[EditTrackView] invalid!")

	    Backbone.history.navigate("/popular", {trigger:true})
	}
	else {
	    this._render()
	}
    },

    render : function() {
	if (DEBUG)
	    console.log("[EditTrackView] render")

	if (this.session.get("state") == app.Session.SessionState.LOGGEDOUT) {
	    this.redirect()
	}

	return this;
    },

    redirect : function() {
	Backbone.history.navigate("/login", {trigger:true})
    },

    _render: function() {
	if (DEBUG)
	    console.log("[EditTrackView] __render")

	$(window).scrollTop(0);

	this.$el.html(this.template(
	    {
		track : this.model.toJSON(),
	    }
	));

	return this;
    },

    _gen_timestamp : function(timeformat) {
	if (this.model.get("service") == "youtube") {
	    return (app.Util.to_ms(timeformat) / 1000)
	}
	else {
	    return app.Util.to_ms(timeformat)
	}
    },

    build_form_obj : function() {
	var timeformat = $("input#track_timeformat").val()
	var timestamp = this._gen_timestamp(timeformat)

	return  {
 	    track : {
		timeformat : $("input#track_timeformat").val(),
		timestamp: timestamp,
		title : $("input#track_title").val(),
		artist : $("input#track_artist").val(),
		genres : $("input#track_genres").val(),
		comment : $("textarea#track_comment").val()
	    }
	};
    },

    delete_track : function(e) {
	if (DEBUG)
	    console.log("[EditTrackView] delete_track")

	e.preventDefault()

	var r = confirm("You sure you want to delete this track?");
	if (!r) {
	    return
	}


	var self = this;
	//post request
	$.ajax({
	    type: "DELETE",
	    url: self.model.url(),
	    data: {},
	    //success - redirect
	    success: function(data, textStatus, jqXHR) {
		if (DEBUG)
		    console.log("[EditTrackView] delete_track:success")

		if (jqXHR.getResponseHeader('AJAX-STATUS') == 302) {
		    window.location.replace(data.location)
		}

		//render errors
		if ('errors' in data) {
		    app.vent.trigger("EditTrackView:error",
				     data.errors)

		    $.growl.error({ title: "Error", 
				    message: "Could not process your request"})
		}
		else {
		    Backbone.history.navigate('/tracks', {trigger:true})
		    $.growl.notice({ title: "Deleted", message: "Track successfully deleted" });
		}

	    },
	    //error - redirect 
	    error: function(jqXHR, textStatus, errorThrown) {
		if (DEBUG)
		    console.log("[EditTrackView] delete_tracK: submit error")
		if (DEBUG)
		    console.log(textStatus)
		if (DEBUG)
		    console.log(errorThrown)
		if (DEBUG)
		    console.log(jqXHR)
	    },

	    complete : function(jqXHR, textStatus) {
		if (DEBUG)
		    console.log("[EditTrackView] delete_track:complete")
	    }
	})
	//otherwise render error


    },

    submit_edit_track : function(e) {
	//check login
	if (DEBUG)
	    console.log("[EditTrackView] submit_edit_track")
	e.preventDefault()

	var self = this;
	var post_data = this.build_form_obj()

	$.ajax({
	    type: "PATCH",
	    url: self.model.url(),
	    data: post_data,
	    beforeSend: function(request) {
		request.setRequestHeader('X-CSRF-Token', $.cookie('csrf_token'))
	    },
	    success: function(data, textStatus, jqXHR) {
		if (DEBUG)
		    console.log("[EditTrackView] success")

		if (jqXHR.getResponseHeader('AJAX-STATUS') == 302) {
		    window.location.replace(data.location)
		}

		if (DEBUG)
		    console.log(data)

		//render errors
		if ('errors' in data) {
		    app.vent.trigger("EditTrackView:error",
				     data.errors)

		    $.growl.error({ title: "Error", 
				    message: "Could not process your request"})

		}
		else {
		    Backbone.history.navigate('/tracks', {trigger:true})
		    $.growl.notice({ title: "Updated", message: "Track successfully updated" });
		}

	    },
	    //redirect 
	    error: function(jqXHR, textStatus, errorThrown) {
		if (DEBUG)
		    console.log("[EditTrackView] submit_edit_track: submit_error")
		if (DEBUG)
		    console.log(textStatus)
		if (DEBUG)
		    console.log(errorThrown)
		if (DEBUG)
		    console.log(jqXHR)
	    },

	    complete : function(jqXHR, textStatus) {
		if (DEBUG)
		    console.log("[EditTrackView] submit_edit_track:Complete")
	    }
	})
	//otherwise render error

    },

    close : function() {
	if (DEBUG)
	    console.log("[EditTrackView] close")

	this.remove()
	this.unbind()
    }

})
