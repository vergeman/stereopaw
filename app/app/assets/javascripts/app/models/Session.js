var app = app || {};

app.Session = Backbone.Model.extend({

    /* Event notes:
     * Session:logged-in, Session:logged-out
     * should only change state of session with
     * current user, not trigger anything (we'll leave
     * that scoped to respective views
     */
     
    initialize: function() {
	console.log("[Sesssion] initialize")

	/*states*/
	this.set("state", app.Session.SessionState.INIT)

	/*set events*/
	this.set("current_user", null)

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
     *  we just set the user and state in session model
     *   Session:logged-in
     *   Session:logged-out
     */

    logged_in : function(data) {
	console.log("[Session] logged_in")

	this.set("state", app.Session.SessionState.LOGGEDIN)

	this.set("current_user", new app.User(data) )
    },

    logged_out: function(data) {
	console.log("[Session] logged_out")

	this.set("state", app.Session.SessionState.LOGGEDOUT)
	/*clear User information for session*/
	this.set("current_user", null)
    },

    /*Auth State
     * auth() 
     * is an initial authentication - someone may page load
     * directly onto a hashed route (i.e. #signup) so we want to 
     * get user session initially
     *
     * check_auth()
     * our SessionState handler that takes functions according
     * to various stages of authentication (i.e. already have
     * user session, mid-request of auth(), error
     * pass listeners accordingly
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
	    function(data) {
		app.vent.trigger("Session:logged-out", data) 
	    }
	)
    },

/*FUCK NOT USED*/
    check_auth: function(loggedin_handler,
			 busyinit_handler, 
			 unauthorized_handler) {

	switch (this.get("state") ) {

	//logged in already
	case app.Session.SessionState.LOGGEDIN :
	    console.log("[Session] loggedin_handler")
	    loggedin_handler()
	    break;
	    
	//mid-auth request (busy) || page was directly loaded (init)
	case app.Session.SessionState.INIT:
	case app.Session.SessionState.BUSY:
	    console.log("[Session] busyinit_handler")
	    busyinit_handler()
	    break;

	//not authorized/ indeterminate state (finished/ error)
	default:
	    console.log("[Session] unauthorized_handler")
	    unauthorized_handler()
	}

    },

    /* request()
     * a wrapper for ajax requests, bound to "Request" event
     * in session. We strap on the csrf token to headers
     */
    request: function(type, url, post_data, cb, cberror) {
	var self = this;
	this.set("state", app.Session.SessionState.BUSY)

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



		/*not a 401 unauthorized error, who knows*/
		if (errorThrown.trim().toLowerCase() != "unauthorized") {
		    self.set("state", app.Session.SessionState.ERROR)
		}else {
		    self.set("state", app.Session.SessionState.LOGGEDOUT)
		}
		console.log("state: " + self.get("state"))
		cberror(jqXHR, textStatus, errorThrown)
	    },

	    complete : function(jqXHR, textStatus) {

		//gets called after success
		console.log("[Request] Complete")
		document.body.style.cursor='default'
	    }
	});
    }
},
{
    SessionState :
    {
	'INIT' : 0,
	'BUSY' : 1,
	'LOGGEDIN' : 2,
	'LOGGEDOUT' : 3,
	'ERROR': 4,

    }

});
