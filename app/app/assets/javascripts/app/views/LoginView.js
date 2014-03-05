
var app = app || {};

app.LoginView = Backbone.View.extend({

    tagName: 'div',
    id: 'content',

    template: JST['users/sign_in'],

    events : {
	'click input[type=submit]' : 'submit',
    },

    initialize: function(session) {
	console.log("[LoginView] initialize")
	var self = this;
	this.session = session

	//LoginView:siginin:error - display form errors
	self.listenTo(app.vent,
		      "LoginView:signin:error",
		      self.show_error)

	//redirect off login view page after login
	app.vent.once("Session:logged-in", 
		      self.redirect, 
		      self)

	_(this).bindAll('close')

	this.authenticity_token = $("meta[name=csrf-token]").attr("content")

    },

    redirect: function() {
	console.log("[LoginView] redirect")
	Backbone.history.navigate("/#", {trigger:true})
	return
    },

    render : function() {
	console.log("[LoginView] render")

	/*only render login screen if logged out
	 *if it's indetermined, we'll listen for 
	 *an updated session change
	 *onus on other listeners
	 */
	console.log(this.session.get("state"))
	if (this.session.get("state") == app.Session.SessionState.LOGGEDOUT) {
	    return this._render()
	}
	this.session.once('change', this.render, this)
	this.$el.html("")
	return this;
    },

    _render: function() {
	console.log("[LoginView] __render")
	this.$el.html(this.template({authenticity_token : this.authenticity_token}) );
	return this;
    },

    show_error: function(jqXHR) {
	console.log("[LoginView] showerror")
	var msg = jqXHR.responseJSON.error
	$('.errormessage').html(msg)
	$('.errormessage').show()
	$('.input-label-prefix > span').css("color", "orangered")
    },

    submit : function(e) {
	e.preventDefault();
	console.log("Submit")

	var data = {
	    user : {
		email : $("input#user_email").val(),
		password : $("input#user_password").val()
	    },
	};

	//sends sign-in request w/ credentials
	this.sign_in(data)
    },


    sign_in: function(login_data) {
	console.log("[LoginView] sign_in")
	var self = this;

	app.vent.trigger(
	    "Request",
	    'POST',
	    '/users/sign_in.json', 
	    login_data,

	    function(data) { 
		if ( ('user' in data) && 
		     data.user.id && 
		     data.user.email) {

		    self.session.set("state", 
			     app.Session.SessionState.LOGGEDIN)
		} else {
		    self.session.set("state", 
			     app.Session.SessionState.LOGGEDOUT)
		}
		console.log("state: " + self.session.get("state"))

		app.vent.trigger("Session:logged-in", data) 
	    },

	    function(jqXHR, textStatus, errorThrown) {
		console.log("[LoginView:sign_in] error")

		//updates form for error handling validation
		app.vent.trigger("LoginView:signin:error", jqXHR)
	    }
	)

    },



    close: function() {
	console.log("[LoginView] close")
	this.remove()
	this.unbind()
    }


});
