var app = app || {};

app.Session = Backbone.Model.extend({

    initialize: function() {
	console.log("[Sesssion] initialize")

	this.set("current_user", null)
	/* 
	 * sucessful sign_in - the POST request
	 * initially called (from views/LoginView or auth() )
	 */
	this.listenTo(app.vent, "Session:sign-in", this.sign_in)
	this.listenTo(app.vent, "Session:sign-out", this.sign_out)

	/*post-authentication success; ie state of session*/
	this.listenTo(app.vent, "Session:logged-in", this.logged_in)
	this.listenTo(app.vent, "Session:logged-out", this.logged_out)

	/*general request event*/
	this.listenTo(app.vent, "Request", this.request)

	/*initial authentitication */
	this.auth()
    },

    /*
     * Events: 
     *   Session:logged-in
     *   Session:logged-out
     */

    logged_in : function(data) {
	console.log("[Session] logged_in")

	this.set("current_user", new app.User(data) )
	console.log(data)

	console.log(this.get("current_user"))
	
	/*trigger whatever is for logged-in state*/

	//need equivalent 'after-sign-in-path' here
	//Backbone.history.navigate('/#', { trigger: true });

    },

    logged_out: function(data) {
	console.log("[Session] logged_out")
	/*clear User information for session*/
	this.set("current_user", null)
	console.log(data)

    },

    /*
     * Request based Events
     *  Session:sign-in
     *  Session:sign-out
     */

    auth: function() {
	console.log("[Session] auth")
	this.request(
	    'POST',
	    '/users/auth.json',
	    null,
	    function(data) { 
		if (data) {
		    app.vent.trigger("Session:logged-in", data) 
		}
	    },
	    function() {}
	)
    },
    sign_out: function() {
	console.log("[Session] sign_out")
	this.request(
	    'DELETE',
	    '/users/sign_out.json', 
	    null,
	    function(data) { 
		app.vent.trigger("Session:logged-out", data) 
	    },
	    function() {}
	)
    },

    sign_in: function(login_data) {
	console.log("[Session] sign_in")
	this.request
	(
	    'POST',
	    '/users/sign_in.json', 
	    login_data,
	    function(data) { 
		app.vent.trigger("Session:logged-in", data) 
	    },
	    function(jqXHR) {
		console.log("[Sign In] error")
		app.vent.trigger("LoginView:signin:error", jqXHR)
	    }
	)

    },

    request: function(type, url, post_data, cb, cberror) {
	var self = this;

	$.ajax({
	    type: type,
	    url: url,
	    data: post_data,
	    beforeSend: function(request) {
		request.setRequestHeader("X-CSRF-Token", $.cookie('csrf_token'));
		document.body.style.cursor='wait'
	    },
	    success: function(data, textStatus, jqXHR) {
		console.log("[Request] Success")

		/*lazy but if instructed to redirect, just do so*/
		if (jqXHR.getResponseHeader('AJAX-STATUS') == 302) {
		    window.location.replace(data.location)
		}

		/*otherwise callback func()*/
		cb(data, textStatus, jqXHR)


	    },

	    error: function(jqXHR, textStatus, errorThrown) {
		console.log("[Request] Error")
		//TODO: return invalid login message
		//returns...
		console.log(jqXHR)
		console.log(textStatus) //error
		console.log(errorThrown) //unauthorized

		cberror(jqXHR, textStatus, errorThrown)
	    },
	    complete : function(jqXHR, textStatus) {
		console.log("[Request] Complete")
		document.body.style.cursor='default'
	    }
	});


    }


});
