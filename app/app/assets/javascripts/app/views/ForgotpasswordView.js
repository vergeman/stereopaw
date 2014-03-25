var app = app || {};

app.ForgotpasswordView = Backbone.View.extend({

    tagName: 'div',
    id: 'content',

    template: JST['users/forgot'],

    events : {
	'click input[type=submit]' : 'submit',
	'click #sign-up-link' : 'signup'
    },

    initialize: function(session) {
	console.log("[ForgotpasswordView] initialize")
	var self = this;
	this.session = session;

	//Forgotpassword:siginup:error - display form errors
	self.listenTo(app.vent,
		      "ForgotpasswordView:signup:error",
		      app.Util.show_error)
	
	/*view inits*/
	_(this).bindAll('close')

	this.authenticity_token = $("meta[name=csrf-token]").attr("content")
	
    },

    signup : function(e) {
	console.log("[ForgotpasswordView] signup")
	e.preventDefault()
	Backbone.history.navigate("/signup", {trigger:true})
    },

    redirect: function() {
	Backbone.history.navigate("/", {trigger:true})
    },

    render : function() {
	console.log("[ForgotpasswordView] render")
	if (this.session.get("state") == app.Session.SessionState.LOGGEDOUT) {
	    return this._render()
	}
	this.session.once('change', this.render, this)
	this.$el.html("")
	return this;

    },

    _render: function() {
	console.log("[ForgotpasswordView] __render")
	this.$el.html(this.template(
	    {
		authenticity_token : this.authenticity_token,
		signup_link: "/meow#signup"
	    }
	) );
	return this;
    },

    submit : function(e) {
	e.preventDefault();
	console.log("Submit")
	var self = this;

	var data = {
	    user : {
		email : $("input#user_email").val()
	    }
	};

	app.vent.trigger("Request",
			 "POST",
			 "/users/password",
			 data,
			 function(data, textStatus, jqXHR) {
			     console.log("[ForgotpasswordView] Request")
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
				 app.vent.trigger("ForgotpasswordView:signup:error", data.errors)
			     }

			     console.log(data)
			     console.log(textStatus)
			     console.log(jqXHR)
			     console.log("state: " + self.session.get("state"))			     
			 },
			 function(jqXHR, textStatus, errorThrown) {}
			)
			 
    },
    
    close: function() {
	console.log("[ForgotpasswordView] close")
	this.remove()
	this.unbind()
    }


});
