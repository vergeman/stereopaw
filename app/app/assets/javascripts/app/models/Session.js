var app = app || {};

app.Session = Backbone.Model.extend({

    /* Event notes:
     * Session:logged-in, Session:logged-out
     * should only change state of session with
     * current user, not trigger anything (we'll leave
     * that scoped to respective views
     */
    
    initialize: function() {
	if (DEBUG)
	    console.log("[Sesssion] initialize")

	/*states*/
	this.set("state", app.Session.SessionState.INIT)

	/*set events*/
	this.set("current_user", null)

	/*post-authentication success; ie state of session*/
	this.listenTo(app.vent, "Session:logged-in", this.logged_in)
	this.listenTo(app.vent, "Session:logged-out", this.logged_out)

	/*storage flag & listener to detect state*/
	this.notifiable = true
	this.auth_notify_listener()

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
	if (DEBUG)
	    console.log("[Session] logged_in")

	this.set("state", app.Session.SessionState.LOGGEDIN)

	this.set("current_user", new app.User(data) )

	this.check_crosstab_reload()
    },

    logged_out: function(data) {
	if (DEBUG)
	    console.log("[Session] logged_out")

	this.set("state", app.Session.SessionState.LOGGEDOUT)
	/*clear User information for session*/
	this.set("current_user", null)

	this.check_crosstab_reload()
    },

    /*init_reload_listener: poor man's cross-tab communication.
     * bind a listener to local storage event; we tie it to a 
     * session state change (auth()): login/logout
     * doesn't listen to own tab, only cross tab
     */

    auth_notify_listener : function() {
	var self = this;

	$(window).bind('storage', function (e) {
	    if (DEBUG)
		console.log("[Session] reload heard")

	    self.notifiable = false
	    self.auth()
	});
    },

    /*on every login/logout event, we fire a localstorage event
     *to browser ping other tabs to re-auth
     *
     *if this.notifiable is false, it was set to false
     *via auth_notify_listener, so we are "in media" fired auth()
     *(consequently will or are firing Session:logged-in/logged-out
     *events)
     *on this auth() run, notifiable is false, so we do not fire 
     *another storage event [prevent infinite loop]
     */

    check_crosstab_reload : function() {
	if (this.notifiable) {
	    /*fire 'notify event'*/
	    localStorage.setItem('authtime', new Date())
	}
	else {
	    this.notifiable = true
	}
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
	if (DEBUG)
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
		document.body.style.cursor='wait'
		request.setRequestHeader('X-CSRF-Token', $.cookie('csrf_token'))
	    },

	    success: function(data, textStatus, jqXHR) {
		if (DEBUG)
		    console.log("[Request] Success")

		/*lazy but if instructed to redirect, just do so*/
		if (jqXHR.getResponseHeader('AJAX-STATUS') == 302) {
		    window.location.replace(data.location)
		}

		/*otherwise callback func()*/
		cb(data, textStatus, jqXHR)

	    },

	    error: function(jqXHR, textStatus, errorThrown) {
		if (DEBUG)
		    console.log("[Request] Error")

		//TODO: return invalid login message
		//returns...
		if (DEBUG)
		    console.log(jqXHR)

		if (DEBUG)
		    console.log(textStatus) //error

		if (DEBUG)
		    console.log(errorThrown) //unauthorized


		/*not a 401 unauthorized error, who knows*/
		if (errorThrown.trim().toLowerCase() != "unauthorized") {
		    self.set("state", app.Session.SessionState.ERROR)
		}else {
		    self.set("state", app.Session.SessionState.LOGGEDOUT)
		}
		if (DEBUG)
		    console.log("state: " + self.get("state"))

		cberror(jqXHR, textStatus, errorThrown)
	    },

	    complete : function(jqXHR, textStatus) {

		//gets called after success
		if (DEBUG)
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
