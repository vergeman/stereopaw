var app = app || {};

app.SignupView = Backbone.View.extend({

    tagName: 'div',
    id: 'content',

    template: JST['users/sign_up'],

    events : {
	'click input[type=submit]' : 'submit',
	'click .haveaccount > a' : 'login'
    },

    initialize: function(session) {
	if (DEBUG)
	    console.log("[SignupView] initialize")
	var self = this;
	this.session = session;

	//Signup:siginup:error - display form errors
	self.listenTo(app.vent,
		      "SignupView:signup:error",
		      app.Util.show_error)
	
	//redirect off signup page after successful signup
	app.vent.once("Session:logged-in", 
		      self.redirect, 
		      self)

	
	/*view inits*/
	_(this).bindAll('close')

	this.authenticity_token = $("meta[name=csrf-token]").attr("content")
	
    },

    login : function(e) {
	if (DEBUG)
	    console.log("[SignupView] login")
	e.preventDefault()
	Backbone.history.navigate("/login", {trigger:true})
    },

    redirect: function() {
	Backbone.history.navigate("/", {trigger:true})
    },

    render : function() {
	if (DEBUG)
	    console.log("[SignupView] render")
	if (this.session.get("state") == app.Session.SessionState.LOGGEDOUT) {
	    return this._render()
	}
	this.session.once('change', this.render, this)
	this.$el.html("")
	return this;

    },

    _render: function() {
	if (DEBUG)
	    console.log("[SignupView] __render")
	this.$el.html(this.template(
	    {
		authenticity_token : this.authenticity_token,
		login_link : "/meow#login"
	    }
	) );
	return this;
    },

    submit : function(e) {
	e.preventDefault();
	if (DEBUG)
	    console.log("Submit")
	var self = this;

	var data = {
	    user : {
		email : $("input#user_email").val(),
		password : $("input#user_password").val(),
		password_confirmation : $("input#user_password_confirmation").val()
	    }
	};

	app.vent.trigger("Request",
			 "POST",
			 "/users.json",
			 data,
			 function(data, textStatus, jqXHR) {
			     if (DEBUG)
				 console.log("[SignupView] Request")
			     /*Signup Errors are a 200 
			      *'successful ajaxresponse
			      */

			     if ( ('user' in data) && 
				  data.user.id && 
				  data.user.email) {

				 self.session.set("state", 
						  app.Session.SessionState.LOGGEDIN)
			     } else {
				 self.session.set("state", 
						  app.Session.SessionState.LOGGEDOUT)
			     }

			     if ('errors' in data) {
				 app.vent.trigger("SignupView:signup:error", data.errors)
			     }

			     if (DEBUG)
				 console.log(data)
			     if (DEBUG)
				 console.log(textStatus)
			     if (DEBUG)
				 console.log(jqXHR)
			     if (DEBUG)
				 console.log("state: " + self.session.get("state"))			     
			 },
			 function(jqXHR, textStatus, errorThrown) {}
			)
	
    },
    
    close: function() {
	if (DEBUG)
	    console.log("[SignupView] close")
	this.remove()
	this.unbind()
    }


});
