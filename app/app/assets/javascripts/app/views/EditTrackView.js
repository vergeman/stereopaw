var app = app || {};

app.EditTrackView = Backbone.View.extend({


    tagName: 'div',
    id: 'content',

    template: JST['tracks/edit'],    

    initialize: function(opts) {
	console.log("[EditTrackView] initialize")
	this.authenticity_token = $("meta[name=csrf-token]").attr("content")
	this.session = opts.session

	this.model = new app.Track()
	this.model.urlRoot = this._gen_url(opts.user_id)
	this.model.id = opts.track_id

	this.listenTo(this.model, "change", this.validmodelcheck)

	this.listenTo(app.vent,
		      "EditTrackView:error",
		      this.show_error)

	this.model.fetch()

	_(this).bindAll('close')

	//if invalid track/error, we redriect back
	//or we just don't allow post
    },

    _gen_url : function(user_id) {
	return "/users/" + user_id + "/tracks/"
    },
    
    events: {
	'click input[type=submit]#track_submit' : 'submit_edit_track',
	'click .cancel' : 'delete_track'
    },

    validmodelcheck : function() {
	if (this.model.get("errors")) {
	    Backbone.history.navigate("/popular", {trigger:true})
	}
	else {
	    this.render()
	}
    },

    render : function() {
	console.log("[EditTrackView] render")
	console.log(this.model)
	console.log(this.session.get("state"))

	if (this.session.get("state") == app.Session.SessionState.LOGGEDIN) {
	    return this._render()
	}
	if (this.session.get("state") == app.Session.SessionState.LOGGEDOUT) {
	    this.redirect()
	    return
	}

	app.vent.once('Session:logged-in', this._render, this)
	return this;
    },
    redirect : function() {
	Backbone.history.navigate("/login", {trigger:true})
    },
    _render: function() {
	console.log("[EditTrackView] __render")
	$(window).scrollTop(0);
	this.$el.html(this.template(
	    {
		track : this.model.toJSON(),
		authenticity_token : this.authenticity_token
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

    show_error: function(errors) {
	console.log("[EdituserView] show_error")
	//clear all errors
	$('small').removeClass('error')
	$('small').html('')
	$('.input-label-prefix > span').css("color", "#333333")

	//add any errors
	_.each(errors, function(val, key) {

	    $('.error_' + key).html(val)
	    $('.error_' + key).addClass('error')
	    $('.error_' + key).parent().prev().children().css("color", "orangered")
	    $('.error_' + key).show()
	});
    },

    delete_track : function(e) {
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
	    beforeSend: function(request) {
		request.setRequestHeader("X-CSRF-Token", $.cookie('csrf_token'));
	    },
	    //redirect 
	    success: function(data, textStatus, jqXHR) {
		console.log("[EditTrackView] delete_track:success")

		if (jqXHR.getResponseHeader('AJAX-STATUS') == 302) {
		    window.location.replace(data.location)
		}
		console.log(data)

		//render errors
		if ('errors' in data) {
		    app.vent.trigger("EditTrackView:error",
				     data.errors)
		}
		else {
		    Backbone.history.navigate('/tracks', {trigger:true})
		}

	    },
	    //redirect 
	    error: function(jqXHR, textStatus, errorThrown) {
		console.log("[EditTrackView] delete_tracK: submit error")
		console.log(textStatus)
		console.log(errorThrown)
		console.log(jqXHR)
	    },

	    complete : function(jqXHR, textStatus) {
		console.log("[EditTrackView] delete_track:complete")
	    }
	})
	//otherwise render error


    },

    submit_edit_track : function(e) {
	//check login
	console.log("[EditTrackView] submit_edit_track")
	e.preventDefault()

	var self = this;
	var post_data = this.build_form_obj()

	$.ajax({
	    type: "PATCH",
	    url: self.model.url(),
	    data: post_data,
	    beforeSend: function(request) {
		request.setRequestHeader("X-CSRF-Token", $.cookie('csrf_token'));
	    },
	    success: function(data, textStatus, jqXHR) {
		console.log("[EditTrackView] success")

		if (jqXHR.getResponseHeader('AJAX-STATUS') == 302) {
		    window.location.replace(data.location)
		}

		console.log(data)

		//render errors
		if ('errors' in data) {
		    app.vent.trigger("EditTrackView:error",
				     data.errors)
		}
		else {
		    Backbone.history.navigate('/tracks', {trigger:true})
		}

	    },
	    //redirect 
	    error: function(jqXHR, textStatus, errorThrown) {
		console.log("[EditTrackView] submit_edit_track: submit_error")
		console.log(textStatus)
		console.log(errorThrown)
		console.log(jqXHR)
	    },

	    complete : function(jqXHR, textStatus) {
		console.log("[EditTrackView] submit_edit_track:Complete")
	    }
	})
	//otherwise render error

    },

    close : function() {
	console.log("[EditTrackView] close")
	this.remove()
	this.unbind()
    }

})
