var app = app || {};

app.Session = Backbone.Model.extend({

    initialize: function() {
	console.log("[Sesssion] initialize")

	this.current_user = null;
	this.csrf_token = $("meta[name=csrf-token]").attr("content")

	/* 
	 * sucessful sign_in - the POST request
	 * called from views/LoginView
	 */
	this.listenTo(app.vent, "Session:sign-in", this.sign_in)
	this.listenTo(app.vent, "Session:sign-out", this.sign_out)

	/*post-authentication success; ie state of session*/
	this.listenTo(app.vent, "Session:logged-in", this.logged_in)
	this.listenTo(app.vent, "Session:logged-out", this.logged_out)

    },
    
    logged_in : function(data) {
	console.log("[Session] logged_in")
	console.log(data)

	this.current_user = new app.User(data)
	console.log(this.current_user)

	/*trigger whatever is for logged-in state*/
    },

    logged_out: function(data) {
	console.log("[Session] logged_out")
	this.current_user = null;
	console.log(data)
	console.log(this)
    },

    sign_out: function() {
	var token = {authenticity_token : this.csrf_token }

	this.request(
	    'DELETE',
	    '/users/sign_out.json', 
	    token,
	    function(data) { 
		app.vent.trigger("Session:logged-out", data) 
	    }
	)

    },

    sign_in: function(login_data) {

	login_data.authenticity_token = this.csrf_token;
	
	this.request
	(
	    'POST',
	    '/users/sign_in.json', 
	    login_data,
	    function(data) { 
		app.vent.trigger("Session:logged-in", data) 
	    }
	)

    },

    request: function(type, url, post_data, cb) {
	var self = this;

	$.ajax({
	    type: type,
	    url: url,
	    data: post_data,
	    beforeSend: function(request) {
		request.setRequestHeader("X-CSRF-Token", self.csrf_token);
	    },
	    success: function(data, textStatus, jqXHR) {
		console.log("[LoginView] Success")
		self.csrf_token = jqXHR.getResponseHeader("X-CSRF-Token")
		cb(data)

	    },

	    error: function(jqXHR, textStatus, errorThrown) {
		console.log("[LoginView] Error")
		//returns...
		console.log(textStatus) //error
		console.log(errorThrown) //unauthorized		
	    }
	});


    }


});
