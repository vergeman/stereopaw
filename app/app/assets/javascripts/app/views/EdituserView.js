
var app = app || {};

app.EdituserView = Backbone.View.extend({

    tagName: 'div',
    id: 'content',

    template: JST['users/edituser'],

    events : {
	'click input[type=submit]#edit-user-button' : 'submit_edit_user'
    },

    initialize: function(session) {
	if (DEBUG)
	    console.log("[Edituser] initialize")
	var self = this;
	this.session = session


	//Signup:siginup:error - display form errors
	self.listenTo(app.vent,
		      "EdituserView:signup:error",
		      app.Util.show_error)

	app.vent.once("Session:logged-out", this.redirect, this)

	//View-specific Initializations
	_(this).bindAll('close')
    },

    redirect : function() {
	if (DEBUG)
	    console.log("[EdituserView] redirect")
	Backbone.history.navigate("/", { trigger:true})
    },

    /*check if we have variables now, we can render,
     * otherwise, wait for login
     */
    render: function() {
	if (DEBUG)
	    console.log("[EdituserView] render")
	if (this.session.get("state") == app.Session.SessionState.LOGGEDIN) {
	    return this._render()
	}
	app.vent.once("Session:logged-in", this._render, this)	    
	return this;
    },

    _render: function() {
	if (DEBUG)
	    console.log("[EdituserView] __render")
	var self = this;

	this.$el.html(
	    this.template(
		{
		    user : self.session.get("current_user"),
		    authenticity_token : $("meta[name=csrf-token]").attr("content")
		    /*
		     * need auth token here since delete is treated
		     * as a tradiitional rails form submission
		     * and not ajax (where jquery-rails appends
		     * a csrf token header)
		     */
		}
	    ));
	return this;
    },

    submit_edit_user : function(e) {
	if (DEBUG)
	    console.log("[EdituserView] submit_edit_user")
	e.preventDefault();
	var self = this;

	var data = {
	    user : {
		email : $("input#user_email").val(),
		password : $("input#user_password").val(),
		password_confirmation : $("input#user_password_confirmation").val(),
		current_password : $("input#user_current_password").val()		
	    },
	};

	app.vent.trigger("Request",
			 "PUT",
			 "/users",
			 data,
			 function(data, textStatus, jqXHR) {
			     if (DEBUG)
				 console.log("[SignupView] Request")
			     /*Signup Errors are a 200 
			      *'successful ajaxresponse
			      */

			     if (DEBUG) {
				 console.log(data)
				 console.log(textStatus)
				 console.log(jqXHR)
			     }

			     if ('errors' in data) {
				 app.vent.trigger("EdituserView:signup:error", data.errors)
				 $.growl.error({ title: "Error", 
						 message: "Could not process your request"})

			     }
			     //a successful update redirects

			     //by default we are logged in
			     self.session.set("state", 
					      app.Session.SessionState.LOGGEDIN);
			     

			 },
			 function(jqXHR, textStatus, errorThrown) {}
			)

	
    },

    close: function() {
	if (DEBUG)
	    console.log("[EdituserView] close")
	this.remove()
	this.unbind()
    }


});
